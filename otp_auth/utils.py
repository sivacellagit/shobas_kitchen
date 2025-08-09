import random
from django.conf import settings
from twilio.rest import Client
import logging

logger = logging.getLogger(__name__)

def generate_otp():
   return str(random.randint(100000, 999999))

def send_otp(phone, otp):
   try:
       client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)

       logger.info(f"Sending OTP {otp} to phone {phone}") 
       # Format the phone number for WhatsApp
       whatsapp_to = f"whatsapp:{phone}"  # Example: whatsapp:+917845502013

        
       message = client.messages.create(
           body=f"Your Shoba’s Kitchen OTP is: {otp}",
           from_=settings.TWILIO_WHATSAPP_FROM,  # Should be like 'whatsapp:+14155238886'
           to=whatsapp_to,
       )


       print(f"OTP sent via WhatsApp: SID={message.sid}")
   except Exception as e:
       print(f"Failed to send WhatsApp OTP: {e}")