import enum
from datetime import datetime

from sqlalchemy import String, Integer, Boolean, ForeignKey, DateTime, Enum, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class PromotionType(str, enum.Enum):
    PERCENTAGE = "PERCENTAGE"
    FIXED = "FIXED"
    FREE_DELIVERY = "FREE_DELIVERY"


class Promotion(Base):
    __tablename__ = "promotions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    type: Mapped[PromotionType] = mapped_column(Enum(PromotionType), default=PromotionType.PERCENTAGE)
    value: Mapped[int] = mapped_column(Integer, default=0)
    min_order_value: Mapped[int] = mapped_column(Integer, default=0)
    usage_limit: Mapped[int] = mapped_column(Integer, default=0)
    used_count: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class LoyaltyTransaction(Base):
    __tablename__ = "loyalty_transactions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    customer_id: Mapped[int] = mapped_column(ForeignKey("customers.id"))
    order_id: Mapped[int | None] = mapped_column(ForeignKey("orders.id"), nullable=True)
    points_earned: Mapped[int] = mapped_column(Integer, default=0)
    points_redeemed: Mapped[int] = mapped_column(Integer, default=0)
    balance_after: Mapped[int] = mapped_column(Integer, default=0)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
