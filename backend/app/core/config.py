from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Fariba Hazara Bakery API"
    API_V1_PREFIX: str = "/api/v1"

    DATABASE_URL: str = "sqlite:///./fariba.db"
    SECRET_KEY: str = "change-me-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    ALGORITHM: str = "HS256"

    CORS_ORIGINS: str = "http://localhost:3000"

    # Payment / messaging integration credentials (stubbed)
    JAZZCASH_MERCHANT_ID: str = ""
    EASYPAISA_STORE_ID: str = ""
    STRIPE_SECRET_KEY: str = ""
    TWILIO_WHATSAPP_FROM: str = ""

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
