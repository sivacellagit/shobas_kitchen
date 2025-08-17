import requests
from django.conf import settings

WHATSAPP_API_URL = 'https://graph.facebook.com/v16.0'  # update as needed
TOKEN = getattr(settings, 'WHATSAPP_TOKEN')
PHONE_NUMBER_ID = getattr(settings, 'WHATSAPP_PHONE_NUMBER_ID')
DEFAULT_LANGUAGE = getattr(settings, 'WHATSAPP_DEFAULT_LANGUAGE', 'en')

API_MESSAGES_URL = f"{WHATSAPP_API_URL}/{PHONE_NUMBER_ID}/messages"

class WhatsAppError(Exception):
    pass


def send_template_message(to_number: str, template_name: str, components: list = None, language_code: str = None):
    """Send a pre-approved template message.
    to_number: E.164 string without plus (e.g. 919876543210) or with + (we pass as-is)
    components: list of template components (body/headers) as per API
    See: https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
    """
    headers = {
        'Authorization': f'Bearer {TOKEN}',
        'Content-Type': 'application/json'
    }
    payload = {
        'messaging_product': 'whatsapp',
        'to': to_number,
        'type': 'template',
        'template': {
            'name': template_name,
            'language': {'code': language_code or DEFAULT_LANGUAGE}
        }
    }
    if components:
        payload['template']['components'] = components

    resp = requests.post(API_MESSAGES_URL, json=payload, headers=headers, timeout=10)
    if resp.status_code not in (200, 201):
        # bubble up useful detail
        try:
            data = resp.json()
        except Exception:
            data = resp.text
        raise WhatsAppError(f"WhatsApp API error ({resp.status_code}): {data}")
    return resp.json()