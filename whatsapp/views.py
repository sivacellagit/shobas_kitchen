from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.utils import timezone
from django.conf import settings
from datetime import timedelta
import random

from .serializers import SendOTPSerializer, VerifyOTPSerializer, SendReceiptSerializer, PromoSerializer
from .utils.whatsapp import send_template_message, WhatsAppError
from .models import WhatsAppOTP, WhatsAppOptIn

from decimal import Decimal
from .models import Order, OrderItem
from customers.models import CustomerProfile
from notifications.utils.whatsapp import send_template_message, WhatsAppError


class SendOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = SendOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data['phone_number']

        # generate 6-digit OTP
        otp = f"{random.randint(0, 999999):06d}"
        expires = timezone.now() + timedelta(minutes=5)

        # save OTP
        w = WhatsAppOTP.objects.create(phone_number=phone_number, otp=otp, expires_at=expires)

        # Compose template components for 'otp_login' template
        components = [
            {
                'type': 'body',
                'parameters': [
                    {'type': 'text', 'text': otp}
                ]
            }
        ]
        try:
            send_template_message(phone_number, template_name='otp_login', components=components)
        except WhatsAppError as e:
            # delete OTP if send failed
            w.delete()
            return Response({'detail': str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        return Response({'detail': 'OTP sent'}, status=status.HTTP_200_OK)


class VerifyOTPView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        phone_number = serializer.validated_data['phone_number']
        otp = serializer.validated_data['otp']

        # find latest unverified OTP for phone
        now = timezone.now()


class SendWhatsAppMessageView(views.APIView):
    permission_classes = [permissions.AllowAny]  # you may change to IsAuthenticated

    def post(self, request):
        order_id = request.data.get("order_id")
        if not order_id:
            return Response({"success": False, "message": "Order ID is required"}, status=400)

        try:
            order = (
                Order.objects
                .select_related("customer")
                .prefetch_related("items__item")
                .get(id=order_id)
            )
        except Order.DoesNotExist:
            return Response({"success": False, "message": "Order not found"}, status=404)

        customer = order.customer
        if not customer or not customer.phone_number:
            return Response({"success": False, "message": "Customer phone number is missing"}, status=400)

        customer_name = customer.name or "Valued Customer"
        phone_number = customer.phone_number  # must be E.164 format for WhatsApp

        # Build items list
        items_text_list = []
        subtotal = Decimal("0.00")
        for order_item in order.items.all():
            if not order_item.item:
                continue
            name = order_item.item.name
            qty = order_item.quantity
            unit_price = order_item.item.price
            line_total = unit_price * qty
            subtotal += line_total
            items_text_list.append(f"{name} × {qty} - ₹{line_total:.2f}")

        items_text = "\n".join(items_text_list)

        # Discount
        discount_amount = subtotal - order.total_amount if subtotal > order.total_amount else Decimal("0.00")

        # Payment method placeholder (extend if you have payment info in model)
        payment_method = "Online Payment" if order.is_online else "Cash on Delivery"

        # Delivery ETA (hardcoded 45 mins if not available)
        delivery_eta = (timezone.now() + timezone.timedelta(minutes=45)).strftime("%I:%M %p")

        # WhatsApp template: order_invoice (6 params)
        components = [
            {
                "type": "body",
                "parameters": [
                    {"type": "text", "text": customer_name},                     # {{1}}
                    {"type": "text", "text": f"#{order.id}"},                     # {{2}}
                    {"type": "text", "text": items_text},                         # {{3}}
                    {"type": "text", "text": f"₹{order.total_amount:.2f}"},       # {{4}}
                    {"type": "text", "text": payment_method},                     # {{5}}
                    {"type": "text", "text": delivery_eta},                        # {{6}}
                ]
            }
        ]

        # Build a preview message for frontend
        preview_message = (
            f"Hello {customer_name}, your order #{order.id} has been confirmed.\n\n"
            f"Items:\n{items_text}\n\n"
            f"Subtotal: ₹{subtotal:.2f}\n"
        )
        if discount_amount > 0:
            preview_message += f"Discount: -₹{discount_amount:.2f}\n"
        preview_message += (
            f"Total: ₹{order.total_amount:.2f}\n"
            f"Payment: {payment_method}\n"
            f"Delivery ETA: {delivery_eta}"
        )

        try:
            res = send_template_message(
                to_number=phone_number,
                template_name="order_invoice",  # must be approved in WhatsApp Business Manager
                components=components
            )
        except WhatsAppError as e:
            return Response({"success": False, "message": str(e)}, status=502)

        return Response({
            "success": True,
            "message": preview_message,
            "whatsapp_response": res
        })
