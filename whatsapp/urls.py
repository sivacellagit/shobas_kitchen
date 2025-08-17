from django.urls import path
from .views import SendOTPView, VerifyOTPView, SendReceiptView, SendPromoView, SendWhatsAppMessageView

urlpatterns = [
    path('send-otp/', SendOTPView.as_view(), name='send-otp'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('send-receipt/', SendReceiptView.as_view(), name='send-receipt'),
    path('send-promo/', SendPromoView.as_view(), name='send-promo'),
    path("send_whatsapp_message/", SendWhatsAppMessageView.as_view(), name="send_whatsapp_message"),
]

# Optional: management command for bulk scheduled promotions
# (put in management/commands/send_promos.py)

# from django.core.management.base import BaseCommand
# from notifications.models import WhatsAppOptIn
# from notifications.utils.whatsapp import send_template_message
#
# class Command(BaseCommand):
#     help = 'Send bulk promo to opted-in customers (simple, synchronous)'
#
#     def add_arguments(self, parser):
#         parser.add_argument('--template', required=True)
#         parser.add_argument('--title', required=False)
#
#     def handle(self, *args, **options):
#         template = options['template']
#         title = options.get('title') or 'Offer'
#         phone_numbers = WhatsAppOptIn.objects.filter(opted_in=True).values_list('phone_number', flat=True)
#         for pn in phone_numbers:
#             try:
#                 send_template_message(pn, template_name=template, components=[{'type':'body','parameters':[{'type':'text','text':title}]}])
#                 self.stdout.write(f"sent to {pn}")
#             except Exception as e:
#                 self.stderr.write(f"failed {pn}: {e}")


# Important notes & checklist
# 1. Create and submit templates in Business Manager. Use exact parameter ordering as in templates.
# 2. Respect opt-in: only send marketing templates to users who have opted in. Save consent records.
# 3. Use Celery/RQ for bulk sending or scheduled promos -- avoid blocking requests.
# 4. Log API responses and failures for audit and troubleshooting.
# 5. Handle rate limits and backoff (Meta docs). Consider retry logic.
# 6. For OTP-based login: after verifying OTP, you can create or fetch a user and return JWT/session.

# Example: Add to your project's root urls.py
# path('api/whatsapp/', include('notifications.urls'))

# End of file