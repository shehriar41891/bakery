"""Notification helpers.

In production these would call the WhatsApp Business API (Twilio / Meta WABA),
an email provider (Resend/SendGrid) and an SMS gateway as described in the PRD.
Here they are stubbed so the flow is observable without external credentials.
"""
import logging

logger = logging.getLogger("notifications")

STATUS_MESSAGES = {
    "CONFIRMED": "Your order {ref} is confirmed! We'll start baking soon.",
    "PREPARING": "Good news — your order {ref} is now being prepared.",
    "READY": "Your order {ref} is ready!",
    "DISPATCHED": "Your order {ref} is out for delivery.",
    "DELIVERED": "Your order {ref} has been delivered. Enjoy! Please leave a review.",
    "CANCELLED": "Your order {ref} has been cancelled. Contact us with any questions.",
}


def send_whatsapp(phone: str, message: str) -> None:
    logger.info("[WHATSAPP -> %s] %s", phone, message)


def send_email(to: str, subject: str, body: str) -> None:
    logger.info("[EMAIL -> %s] %s", to, subject)


def notify_status_change(phone: str, reference: str, status: str) -> None:
    template = STATUS_MESSAGES.get(status)
    if template:
        send_whatsapp(phone, template.format(ref=reference))
