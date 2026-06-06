from fastapi import APIRouter

from app.api.v1 import products, orders, customers, delivery, promotions, analytics

api_router = APIRouter()
api_router.include_router(products.router)
api_router.include_router(orders.router)
api_router.include_router(customers.router)
api_router.include_router(delivery.router)
api_router.include_router(promotions.router)
api_router.include_router(analytics.router)
