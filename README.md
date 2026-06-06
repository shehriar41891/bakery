# Fariba Hazara Bakery — Online Ordering & Business Management Platform

A full-stack implementation scaffold built from the PRD (v1.0). It splits cleanly
into a **Next.js** customer/admin frontend and a **Python (FastAPI)** backend with a
relational database, matching the data models and flows in the requirements document.

> The PRD suggested a Node/NestJS backend. This scaffold uses **FastAPI** instead, as
> requested — it is the idiomatic Python equivalent (typed, async, OpenAPI docs out of
> the box) and maps the same way onto PostgreSQL + an ORM.

```
fariba-hazara-bakery/
├── backend/                 # FastAPI + SQLAlchemy + Pydantic
│   ├── app/
│   │   ├── core/            # config, security (JWT, password hashing)
│   │   ├── db/              # engine, session, declarative base
│   │   ├── models/          # SQLAlchemy ORM: Product, Order, Customer, …
│   │   ├── schemas/         # Pydantic request/response models
│   │   ├── api/v1/          # routers: products, orders, customers,
│   │   │                    #          delivery, promotions, analytics
│   │   └── main.py          # app factory + CORS + router mounting
│   ├── seed.py              # demo data (products, slots, promo, orders)
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/                # Next.js 14 (App Router) + TypeScript + Tailwind
│   └── src/
│       ├── app/             # routes: /, /menu, /product/[slug], /cart,
│       │                    #         /checkout, /account, /admin, /admin/orders
│       ├── components/      # Navbar, ProductCard, Providers
│       ├── lib/             # api client, types, formatters
│       └── store/           # Zustand cart store
├── docker-compose.yml       # db + backend + frontend
└── README.md
```

## Tech stack

| Layer        | Choice                                             |
|--------------|----------------------------------------------------|
| Frontend     | Next.js 14 (App Router), TypeScript, Tailwind CSS  |
| State / data | Zustand (cart) + TanStack React Query (server data)|
| Charts       | Recharts                                           |
| Backend      | FastAPI, SQLAlchemy 2.0, Pydantic v2               |
| Database     | PostgreSQL (SQLite fallback for zero-setup dev)    |
| Auth         | JWT + bcrypt (scaffolded in `core/security.py`)    |

## Run it

### Option A — Docker (Postgres + both apps)

```bash
docker compose up --build
# Frontend  → http://localhost:3000
# API docs  → http://localhost:8000/docs
```

### Option B — Local dev

**Backend** (defaults to SQLite, no DB install needed):

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python seed.py                       # load demo data + FIRST10 promo
uvicorn app.main:app --reload        # http://localhost:8000
```

**Frontend:**

```bash
cd frontend
npm install
cp .env.local.example .env.local     # NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
npm run dev                          # http://localhost:3000
```

## API surface (`/api/v1`)

| Method | Path                          | Purpose                              |
|--------|-------------------------------|--------------------------------------|
| GET    | `/products/categories`        | List categories                      |
| GET    | `/products?category=&search=` | List/filter products                 |
| GET    | `/products/{slug}`            | Product detail with variants         |
| POST   | `/orders`                     | Place an order (applies promo+points)|
| GET    | `/orders?status=`             | Admin order queue                    |
| GET    | `/orders/{reference}`         | Order detail / tracking              |
| PATCH  | `/orders/{reference}/status`  | Advance status → triggers WhatsApp   |
| POST   | `/promotions/validate`        | Validate a discount code             |
| GET    | `/delivery/slots?date=`       | Available delivery slots             |
| GET    | `/customers`                  | CRM list                             |
| GET    | `/analytics/summary`          | Revenue, top products, payment mix   |

Interactive docs are auto-generated at `http://localhost:8000/docs`.

## Data models

Implemented per PRD §8: `Category`, `Product`, `ProductVariant`, `Customer`,
`Address`, `Order`, `OrderItem`, `DeliverySlot`, `Promotion`, `LoyaltyTransaction`.
Order status follows the PRD lifecycle:
`PENDING → CONFIRMED → PREPARING → READY → DISPATCHED → DELIVERED` (or `CANCELLED`).

## What's stubbed vs. real

**Real:** full data model, REST API with validation, promo + loyalty calculation,
order lifecycle, analytics aggregation, and a working Next.js frontend wired to the API.

**Stubbed (clearly isolated for you to plug credentials into):**
- Payments — JazzCash / EasyPaisa / Stripe redirect & webhook (`order.payment_status`)
- Messaging — WhatsApp / email / SMS live in `app/api/v1/notifications.py` and log
  to the console; swap in Twilio/Meta WABA + Resend/SendGrid.
- Auth — JWT helpers exist in `core/security.py`; phone-OTP login flow is not yet wired.

## Next steps toward production (PRD Phase 1 → 3)
1. Add Alembic migrations (replace `Base.metadata.create_all`).
2. Wire phone-OTP auth + protect `/admin` and customer endpoints.
3. Integrate a real payment gateway and verify via webhook before confirming orders.
4. Connect WhatsApp Business API for the notification stubs.
5. Add Urdu (i18n) and the PWA manifest for installable mobile (Phase 2).
