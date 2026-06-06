from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.delivery import DeliverySlot
from app.schemas.misc import DeliverySlotOut

router = APIRouter(prefix="/delivery", tags=["delivery"])


@router.get("/slots", response_model=list[DeliverySlotOut])
def list_slots(date: str | None = Query(default=None), db: Session = Depends(get_db)):
    stmt = select(DeliverySlot).where(DeliverySlot.is_available.is_(True))
    if date:
        stmt = stmt.where(DeliverySlot.date == date)
    return db.scalars(stmt.order_by(DeliverySlot.date, DeliverySlot.start_time)).all()
