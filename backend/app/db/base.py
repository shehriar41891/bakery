from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """Base class for all ORM models."""
    pass


# Import models here so Base.metadata is aware of every table.
from app.models.product import Product, ProductVariant, Category  # noqa: E402,F401
from app.models.customer import Customer, Address  # noqa: E402,F401
from app.models.order import Order, OrderItem  # noqa: E402,F401
from app.models.delivery import DeliverySlot  # noqa: E402,F401
from app.models.promotion import Promotion, LoyaltyTransaction  # noqa: E402,F401
