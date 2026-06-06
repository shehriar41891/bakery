from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.promotion import Promotion, PromotionType
from app.schemas.misc import PromotionValidate, PromotionResult

router = APIRouter(prefix="/promotions", tags=["promotions"])


def compute_discount(promo: Promotion, subtotal: int) -> int:
    if promo.type == PromotionType.PERCENTAGE:
        return round(subtotal * promo.value / 100)
    if promo.type == PromotionType.FIXED:
        return min(promo.value, subtotal)
    return 0  # FREE_DELIVERY handled at order level


@router.post("/validate", response_model=PromotionResult)
def validate_promo(payload: PromotionValidate, db: Session = Depends(get_db)):
    promo = db.scalar(
        select(Promotion).where(Promotion.code == payload.code.upper(), Promotion.is_active.is_(True))
    )
    if not promo:
        return PromotionResult(valid=False, message="Invalid or expired code")
    if promo.usage_limit and promo.used_count >= promo.usage_limit:
        return PromotionResult(valid=False, message="This code has reached its usage limit")
    if payload.subtotal < promo.min_order_value:
        return PromotionResult(valid=False, message=f"Minimum order is Rs {promo.min_order_value}")
    return PromotionResult(
        valid=True,
        discount=compute_discount(promo, payload.subtotal),
        message=f"{promo.code} applied",
    )
