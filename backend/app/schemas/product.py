from pydantic import BaseModel, ConfigDict


class VariantOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    size: str
    flavour: str
    frosting: str
    price_adjustment: int
    stock_status: str


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    name: str
    emoji: str


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    slug: str
    name_en: str
    name_ur: str
    description: str
    category_id: str
    base_price: int
    image_url: str
    prep_time_hours: int
    allow_custom_message: bool
    is_eggless_available: bool
    is_active: bool
    badge: str
    variants: list[VariantOut] = []


class ProductCreate(BaseModel):
    slug: str
    name_en: str
    description: str = ""
    category_id: str
    base_price: int
    prep_time_hours: int = 24
    badge: str = ""
    is_eggless_available: bool = False
    allow_custom_message: bool = False
