from collections import defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.order import Order, OrderStatus
from app.schemas.misc import AnalyticsSummary

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/summary", response_model=AnalyticsSummary)
def summary(db: Session = Depends(get_db)):
    orders = db.scalars(select(Order).options(selectinload(Order.items))).all()
    active = [o for o in orders if o.status != OrderStatus.CANCELLED]

    total_revenue = sum(o.total for o in active)
    total_orders = len(active)
    aov = round(total_revenue / total_orders) if total_orders else 0
    pending = len([o for o in orders if o.status not in (OrderStatus.DELIVERED, OrderStatus.CANCELLED)])

    by_day: dict[str, int] = defaultdict(int)
    by_product: dict[str, int] = defaultdict(int)
    by_payment: dict[str, int] = defaultdict(int)
    for o in active:
        by_day[o.delivery_date or "unknown"] += o.total
        by_payment[o.payment_method] += 1
        for it in o.items:
            by_product[it.name] += it.quantity

    top_products = sorted(
        ({"name": k, "value": v} for k, v in by_product.items()),
        key=lambda x: x["value"], reverse=True,
    )[:6]
    revenue_by_day = sorted(
        ({"day": k, "revenue": v} for k, v in by_day.items()), key=lambda x: x["day"]
    )
    payment_mix = [{"name": k, "value": v} for k, v in by_payment.items()]

    return AnalyticsSummary(
        total_revenue=total_revenue,
        total_orders=total_orders,
        average_order_value=aov,
        pending_orders=pending,
        revenue_by_day=revenue_by_day,
        top_products=top_products,
        payment_mix=payment_mix,
    )
