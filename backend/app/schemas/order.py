from datetime import datetime
from pydantic import BaseModel, ConfigDict

from app.models.order import OrderStatus


class OrderItemIn(BaseModel):
    product_id: int | None = None
    name: str
    emoji: str = ""
    size: str = ""
    flavour: str = ""
    message: str = ""
    quantity: int = 1
    unit_price: int


class OrderItemOut(OrderItemIn):
    model_config = ConfigDict(from_attributes=True)
    id: int


class OrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    items: list[OrderItemIn]
    payment_method: str = "JazzCash"
    delivery_type: str = "delivery"
    delivery_zone: str = ""
    delivery_address: str = ""
    delivery_date: str = ""
    delivery_slot: str = ""
    promo_code: str | None = None
    redeem_points: int = 0
    special_notes: str = ""


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    reference: str
    customer_name: str
    customer_phone: str
    status: OrderStatus
    subtotal: int
    delivery_fee: int
    discount_amount: int
    total: int
    payment_method: str
    payment_status: str
    delivery_type: str
    delivery_zone: str
    delivery_address: str
    delivery_date: str
    delivery_slot: str
    special_notes: str
    created_at: datetime
    items: list[OrderItemOut] = []


class OrderStatusUpdate(BaseModel):
    status: OrderStatus
