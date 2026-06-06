"""Seed the database with categories, products, slots, a promo and demo orders.

Run from the backend/ directory:  python seed.py
"""
from datetime import date, timedelta

from app.db.base import Base
from app.db.session import engine, SessionLocal
from app.models.product import Category, Product, ProductVariant
from app.models.delivery import DeliverySlot
from app.models.promotion import Promotion, PromotionType
from app.models.customer import Customer
from app.models.order import Order, OrderItem, OrderStatus

CATEGORIES = [
    ("cakes", "Celebration Cakes", "🎂"),
    ("cupcakes", "Cupcakes", "🧁"),
    ("pastries", "Pastries & Desserts", "🥐"),
    ("brownies", "Brownies & Bars", "🍫"),
    ("cookies", "Cookies", "🍪"),
    ("seasonal", "Eid Specials", "🌙"),
]

PRODUCTS = [
    # slug, name, cat, base, prep, emoji, badge, eggless, custom, variants[(size,flavour,adj)]
    ("classic-birthday-cake", "Classic Birthday Cake", "cakes", 2800, 72, "🎂", "Bestseller", True, True,
     [('6"', "Vanilla", 0), ('8"', "Chocolate", 1200), ('10"', "Red Velvet", 2600)]),
    ("chocolate-fudge-drip", "Chocolate Fudge Drip", "cakes", 3400, 72, "🍰", "Pre-order", False, True,
     [('6"', "Dark Chocolate", 0), ('8"', "Milk Chocolate", 1400)]),
    ("red-velvet-cupcakes", "Red Velvet Cupcakes", "cupcakes", 1200, 24, "🧁", "", True, False,
     [("Box of 6", "Cream Cheese", 0), ("Box of 12", "Cream Cheese", 1100)]),
    ("nutella-cupcakes", "Nutella Filled Cupcakes", "cupcakes", 1400, 24, "🧁", "", False, False,
     [("Box of 6", "Nutella Core", 0), ("Box of 12", "Nutella Core", 1300)]),
    ("chocolate-eclairs", "Chocolate Éclairs", "pastries", 950, 24, "🥐", "", False, False,
     [("Box of 4", "Classic Vanilla", 0), ("Box of 8", "Coffee Crème", 880)]),
    ("mille-feuille", "Mille-Feuille", "pastries", 1100, 24, "🍮", "New", False, False,
     [("Box of 4", "Vanilla Bean", 0)]),
    ("fudge-brownie-box", "Fudge Brownie Box", "brownies", 1300, 24, "🍫", "Bestseller", True, False,
     [("Box of 9", "Classic Fudge", 0), ("Box of 16", "Walnut", 1100)]),
    ("blondie-bars", "Blondie Bars", "brownies", 1200, 24, "🟫", "", False, False,
     [("Box of 9", "White Chocolate", 0)]),
    ("choc-chip-cookies", "Choc Chip Cookies", "cookies", 900, 24, "🍪", "", True, False,
     [("Box of 6", "Classic", 0), ("Box of 12", "Sea Salt", 800)]),
    ("iced-sugar-cookies", "Iced Sugar Cookies", "cookies", 1000, 48, "⭐", "Custom", False, True,
     [("Box of 6", "Vanilla", 0), ("Box of 12", "Almond", 900)]),
    ("eid-dry-fruit-cake", "Eid Dry Fruit Cake", "seasonal", 3200, 72, "🌙", "Eid Special", True, False,
     [('8"', "Classic Spice", 0), ('10"', "Saffron & Cardamom", 1800)]),
    ("eid-cake-box", "Eid Cake Box", "seasonal", 2400, 48, "🎁", "Eid Special", False, False,
     [("Box of 12", "Assorted", 0), ("Box of 24", "Assorted", 2100)]),
]


def run():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    for i, (cid, name, emoji) in enumerate(CATEGORIES):
        db.add(Category(id=cid, name=name, emoji=emoji, sort_order=i))

    for slug, name, cat, base, prep, emoji, badge, eggless, custom, variants in PRODUCTS:
        p = Product(
            slug=slug, name_en=name, category_id=cat, base_price=base, prep_time_hours=prep,
            badge=badge, is_eggless_available=eggless, allow_custom_message=custom,
            description=f"Freshly baked {name.lower()} — handcrafted to order.",
            variants=[ProductVariant(size=s, flavour=f, price_adjustment=adj) for s, f, adj in variants],
        )
        db.add(p)

    # Delivery slots for the next 7 days
    slots = [("10:00", "12:00"), ("12:00", "14:00"), ("14:00", "16:00"),
             ("16:00", "18:00"), ("18:00", "20:00")]
    for d in range(7):
        day = (date.today() + timedelta(days=d)).isoformat()
        for s, e in slots:
            db.add(DeliverySlot(date=day, start_time=s, end_time=e, max_orders=10))

    db.add(Promotion(code="FIRST10", type=PromotionType.PERCENTAGE, value=10,
                     min_order_value=0, usage_limit=0, is_active=True))

    # Demo customers + orders
    names = [("Ayesha Khan", "+92 311 1234567"), ("Usman Tariq", "+92 312 7654321"),
             ("Sana Malik", "+92 313 5556667")]
    customers = []
    for n, ph in names:
        c = Customer(name=n, phone=ph, email=n.split()[0].lower() + "@example.com",
                     loyalty_points=120, total_orders=0, total_spend=0)
        db.add(c)
        customers.append(c)
    db.flush()

    statuses = [OrderStatus.PREPARING, OrderStatus.DISPATCHED, OrderStatus.CONFIRMED]
    for i, c in enumerate(customers):
        order = Order(
            reference=f"FHB-204{i}", customer_id=c.id, customer_name=c.name, customer_phone=c.phone,
            status=statuses[i], subtotal=2800, delivery_fee=250, total=3050,
            payment_method=["JazzCash", "EasyPaisa", "Card"][i], payment_status="Paid",
            delivery_type="delivery", delivery_zone="Bahria Town",
            delivery_date=(date.today() + timedelta(days=i)).isoformat(),
            delivery_slot="14:00 – 16:00",
            items=[OrderItem(name="Classic Birthday Cake", emoji="🎂", size='8"',
                             flavour="Chocolate", quantity=1, unit_price=2800)],
        )
        c.total_orders, c.total_spend = 1, 3050
        db.add(order)

    db.commit()
    db.close()
    print("✓ Seeded categories, products, slots, promo (FIRST10) and demo orders.")


if __name__ == "__main__":
    run()
