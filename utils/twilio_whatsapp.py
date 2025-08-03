# utils/twilio_whatsapp.py


from twilio.rest import Client
import os
from django.conf import settings


# Optional: Load from settings or environment
TWILIO_ACCOUNT_SID = getattr(settings, "TWILIO_ACCOUNT_SID", os.getenv("TWILIO_ACCOUNT_SID"))
TWILIO_AUTH_TOKEN = getattr(settings, "TWILIO_AUTH_TOKEN", os.getenv("TWILIO_AUTH_TOKEN"))
TWILIO_WHATSAPP_FROM = getattr(settings, "TWILIO_WHATSAPP_FROM", "whatsapp:+14155238886")  # Twilio sandbox number
#TWILIO_WHATSAPP_FROM = getattr(settings, "TWILIO_WHATSAPP_FROM", "whatsapp:+19853153138")


client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


def send_whatsapp_message(to_number, message):
   """
   Sends a WhatsApp message using Twilio API.
   to_number: E.g., '8056063658' (Indian number)
   """
   try:
       full_to = f"whatsapp:+91{to_number}"  # Assumes Indian numbers
       twilio_msg = client.messages.create(
           body=message,
           from_=TWILIO_WHATSAPP_FROM,
           to=full_to
       )
       print(f"[Twilio] Message SID: {twilio_msg.sid}, Status: {twilio_msg.status}")
       return twilio_msg.sid
   except Exception as e:
       print(f"[Twilio Error] Failed to send WhatsApp message: {e}")
       return None