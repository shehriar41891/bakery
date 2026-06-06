import enum
from datetime import datetime

from sqlalchemy import String, Integer, ForeignKey, DateTime, Enum, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    PREPARING = "PREPARING"
    READY = "READY"
    DISPATCHED = "DISPATCHED"
    DELIVERED = "DELIVERED"
    CANCELLED = "CANCELLED"


class Order(Base):
    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    reference: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    customer_id: Mapped[int | None] = mapped_column(ForeignKey("customers.id"), nullable=True)
    customer_name: Mapped[str] = mapped_column(String(160))
    customer_phone: Mapped[str] = mapped_column(String(30))

    status: Mapped[OrderStatus] = mapped_column(Enum(OrderStatus), default=OrderStatus.CONFIRMED)
    subtotal: Mapped[int] = mapped_column(Integer, default=0)
    delivery_fee: Mapped[int] = mapped_column(Integer, default=0)
    discount_amount: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer, default=0)

    payment_method: Mapped[str] = mapped_column(String(40), default="JazzCash")
    payment_status: Mapped[str] = mapped_column(String(20), default="Pending")

    delivery_type: Mapped[str] = mapped_column(String(20), default="delivery")
    delivery_zone: Mapped[str] = mapped_column(String(120), default="")
    delivery_address: Mapped[str] = mapped_column(Text, default="")
    delivery_date: Mapped[str] = mapped_column(String(20), default="")
    delivery_slot: Mapped[str] = mapped_column(String(40), default="")

    special_notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())

    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan"
    )


class OrderItem(Base):
    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"))
    product_id: Mapped[int | None] = mapped_column(ForeignKey("products.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(160))
    emoji: Mapped[str] = mapped_column(String(8), default="")
    size: Mapped[str] = mapped_column(String(60), default="")
    flavour: Mapped[str] = mapped_column(String(60), default="")
    message: Mapped[str] = mapped_column(String(120), default="")
    quantity: Mapped[int] = mapped_column(Integer, default=1)
    unit_price: Mapped[int] = mapped_column(Integer, default=0)

    order: Mapped["Order"] = relationship(back_populates="items")
