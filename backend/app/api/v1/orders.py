import random

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.order import Order, OrderItem, OrderStatus
from app.models.customer import Customer
from app.models.promotion import Promotion
from app.schemas.order import OrderCreate, OrderOut, OrderStatusUpdate
from app.api.v1.promotions import compute_discount
from app.api.v1 import notifications

router = APIRouter(prefix="/orders", tags=["orders"])

DELIVERY_FEE = 250
POINTS_PER_100 = 1  # 1 point per Rs 100 spent


def _make_reference() -> str:
    return "FHB-" + str(random.randint(2100, 9999))


@router.get("", response_model=list[OrderOut])
def list_orders(
    status: OrderStatus | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())
    if status:
        stmt = stmt.where(Order.status == status)
    return db.scalars(stmt).all()


@router.get("/{reference}", response_model=OrderOut)
def get_order(reference: str, db: Session = Depends(get_db)):
    order = db.scalar(
        select(Order).options(selectinload(Order.items)).where(Order.reference == reference)
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("", response_model=OrderOut, status_code=201)
def create_order(payload: OrderCreate, db: Session = Depends(get_db)):
    subtotal = sum(i.unit_price * i.quantity for i in payload.items)
    if not payload.items:
        raise HTTPException(status_code=400, detail="Order must contain at least one item")

    delivery_fee = DELIVERY_FEE if payload.delivery_type == "delivery" else 0
    discount = 0

    if payload.promo_code:
        promo = db.scalar(
            select(Promotion).where(
                Promotion.code == payload.promo_code.upper(), Promotion.is_active.is_(True)
            )
        )
        if promo and subtotal >= promo.min_order_value:
            discount += compute_discount(promo, subtotal)
            promo.used_count += 1

    # Loyalty redemption (capped at 20% of subtotal)
    customer = db.scalar(select(Customer).where(Customer.phone == payload.customer_phone))
    redeem = 0
    if payload.redeem_points and customer:
        redeem = min(payload.redeem_points, customer.loyalty_points, round(subtotal * 0.2))
        discount += redeem

    total = max(0, subtotal + delivery_fee - discount)

    order = Order(
        reference=_make_reference(),
        customer_id=customer.id if customer else None,
        customer_name=payload.customer_name,
        customer_phone=payload.customer_phone,
        status=OrderStatus.CONFIRMED,
        subtotal=subtotal,
        delivery_fee=delivery_fee,
        discount_amount=discount,
        total=total,
        payment_method=payload.payment_method,
        payment_status="Pending" if payload.payment_method == "Cash on Delivery" else "Paid",
        delivery_type=payload.delivery_type,
        delivery_zone=payload.delivery_zone,
        delivery_address=payload.delivery_address,
        delivery_date=payload.delivery_date,
        delivery_slot=payload.delivery_slot,
        special_notes=payload.special_notes,
        items=[OrderItem(**i.model_dump()) for i in payload.items],
    )
    db.add(order)

    earned = total // 100 * POINTS_PER_100
    if customer:
        customer.loyalty_points = customer.loyalty_points - redeem + earned
        customer.total_orders += 1
        customer.total_spend += total

    db.commit()
    db.refresh(order)

    notifications.notify_status_change(order.customer_phone, order.reference, "CONFIRMED")
    notifications.send_email(payload.customer_name, f"Order {order.reference} confirmed", "Receipt attached")
    return order


@router.patch("/{reference}/status", response_model=OrderOut)
def update_status(reference: str, payload: OrderStatusUpdate, db: Session = Depends(get_db)):
    order = db.scalar(
        select(Order).options(selectinload(Order.items)).where(Order.reference == reference)
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    notifications.notify_status_change(order.customer_phone, order.reference, payload.status.value)
    return order
