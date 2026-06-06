from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.db.session import get_db
from app.models.product import Product, Category
from app.schemas.product import ProductOut, CategoryOut, ProductCreate

router = APIRouter(prefix="/products", tags=["products"])


@router.get("/categories", response_model=list[CategoryOut])
def list_categories(db: Session = Depends(get_db)):
    return db.scalars(select(Category).order_by(Category.sort_order)).all()


@router.get("", response_model=list[ProductOut])
def list_products(
    category: str | None = Query(default=None),
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    stmt = select(Product).options(selectinload(Product.variants)).where(Product.is_active.is_(True))
    if category and category != "all":
        stmt = stmt.where(Product.category_id == category)
    if search:
        stmt = stmt.where(Product.name_en.ilike(f"%{search}%"))
    return db.scalars(stmt).all()


@router.get("/{slug}", response_model=ProductOut)
def get_product(slug: str, db: Session = Depends(get_db)):
    product = db.scalar(
        select(Product).options(selectinload(Product.variants)).where(Product.slug == slug)
    )
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("", response_model=ProductOut, status_code=201)
def create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    product = Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product
