from pydantic import BaseModel, ConfigDict


class CustomerOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    phone: str
    email: str
    loyalty_points: int
    total_orders: int
    total_spend: int


class DeliverySlotOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    date: str
    start_time: str
    end_time: str
    max_orders: int
    current_orders: int
    is_available: bool


class PromotionValidate(BaseModel):
    code: str
    subtotal: int


class PromotionResult(BaseModel):
    valid: bool
    discount: int = 0
    message: str = ""


class AnalyticsSummary(BaseModel):
    total_revenue: int
    total_orders: int
    average_order_value: int
    pending_orders: int
    revenue_by_day: list[dict]
    top_products: list[dict]
    payment_mix: list[dict]
