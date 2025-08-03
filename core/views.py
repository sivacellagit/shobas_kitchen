from rest_framework import viewsets, generics
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny, IsAdminUser
from core.throttles import FeedbackRateThrottle
from rest_framework import status
from django.contrib.auth.models import User
import logging
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from twilio.rest import Client
from django.conf import settings
from .models import (
   MenuCategory, MenuItem, Order, OrderItem,
   InventoryItem, Feedback, LoyaltyPointHistory, Offer, Referral,
   Employee, DailySalesSummary, Config
)
from customers.models import CustomerProfile
from .serializers import (
   MenuCategorySerializer, MenuItemSerializer,
   OrderSerializer, OrderItemSerializer, InventoryItemSerializer,
   OfferSerializer, LoyaltyPointHistorySerializer,
   FeedbackSerializer, CustomLoginSerializer,
   ReferralSerializer, EmployeeSerializer, DailySalesSummarySerializer,
   CustomerRegistrationSerializer, StaffSerializer, AdminUserSerializer
)
from customers.serializers import CustomerProfileSerializer
from utils.whatsapp import build_whatsapp_receipt
from utils.twilio_whatsapp import send_whatsapp_message
from customers.awards import award_loyalty_points
from rest_framework_simplejwt.views import TokenObtainPairView


logger = logging.getLogger(__name__)


@api_view(['GET'])
@permission_classes([AllowAny])
def test_logging(request):
 logger.info("This is an INFO log.")
 logger.warning("This is a WARNING log.")
 logger.error("This is an ERROR log.")
 return Response({"message": "Logging test done. Check log files."})


@api_view(["GET"])
def get_discount_percent(request):
   from .models import Config
   percent = Config.get_discount_percent()
   logger.info("discount percent")
   return Response({"value": str(percent)})


@api_view(["POST"])
def send_whatsapp_invoice_message(request):
    customer_name = request.data.get("customer_name")
    phone_number = request.data.get("phone")
    order_id = request.data.get("order_id")
    total = request.data.get("total")
    items = request.data.get("items", [])
    if not all([phone_number, customer_name, order_id, total, items]):
         return Response({"error": "Missing required fields"}, status=400)
    message_lines = [
         "🧾 *Shoba’s Kitchen - Order Confirmation*",
         "",
         f"🧍 Customer: {customer_name}",
         f"📞 Phone: {phone_number}",
         f"🛒 Order ID: #{order_id}",
         f"🕒 Date: {request.data.get('date', '')}",
         "",
         "🍽️ Items:"
    ]
    for item in items:
         item_name = item.get("name", "Item")
         quantity = item.get("quantity", 1)
         price = item.get("price", 0)
         message_lines.append(f"• {item_name} x {quantity} — ₹{price}")
    message_lines.append("")
    message_lines.append(f"💰 Total: ₹{total}")
    message_lines.append("")
    message_lines.append("Thank you for ordering with us! 🙏")
    full_message = "\n".join(message_lines)
    try:
         client = Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
         message = client.messages.create(
               from_="whatsapp:+14155238886",
               to=f"whatsapp:{phone_number}",
               body=full_message
         )
         return Response({"message_sid": message.sid}, status=200)
    except Exception as e:
         return Response({"error": str(e)}, status=500)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_discount_config(request):
    item_level_discount = Config.get_config_value("first_time_discount_percent", 10.0)
    first_order_discount = Config.get_config_value("first_order_discount_percent", 15.0)
    return Response({
         "item_level_discount_percent": item_level_discount,
         "first_order_discount_percent": first_order_discount,
    })


@api_view(["GET"])
@permission_classes([AllowAny])
def get_all_discount_configs(request):
    config_keys = ["first_order_discount_percent", "first_time_discount_percent"]
    discounts = {}
    for key in config_keys:
         try:
               config = Config.objects.get(key=key)
               discounts[key] = float(config.value)
         except Config.DoesNotExist:
               if key == "first_order_discount_percent":
                    discounts[key] = 10.0
               elif key == "first_time_discount_percent":
                    discounts[key] = 5.0
    return Response(discounts)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_purchased_item_ids(request): 
    customer_id = request.GET.get("customer_id")
    if not customer_id:
         return Response({"error": "Customer ID is required."}, status=400)
    try:
         customer = CustomerProfile.objects.get(id=customer_id)
         purchased_item_ids_qs = OrderItem.objects.filter(
               order__customer=customer
         ).values_list("item_id", flat=True).distinct()
         purchased_item_ids = list(purchased_item_ids_qs)
         has_prior_orders = Order.objects.filter(customer=customer).exists()
         return Response({
               "purchased_item_ids": purchased_item_ids,
               "has_prior_orders": has_prior_orders
         })
    except CustomerProfile.DoesNotExist:
         return Response({
               "purchased_item_ids": [],
               "has_prior_orders": False
         })
              
@api_view(['POST'])
def place_order(request):
   try:
        name = request.data.get("customer_name")
        phone = request.data.get("customer_phone")
        address = request.data.get("customer_address")
        email = request.data.get("customer_email")
        items = request.data.get("items", [])
        total_amount = request.data.get("total_amount")
        if not all([name, phone, address, items]):
             return Response({"error": "Missing customer or item data"}, status=400)
        dummy_user, _ = User.objects.get_or_create(username="anonymous_user")
        customer = CustomerProfile.objects.create(
             user=dummy_user,
             name=name,
             address=address,
             email=email,
             phone_number=phone,
        )
        order = Order.objects.create(
             customer=customer,
             status="pending",
             total_amount=total_amount,
             is_online=True
        )
        for item in items:
             menu_item = MenuItem.objects.get(id=item["item"])
             OrderItem.objects.create(
                   order=order,
                   item=menu_item,
                   quantity=item["quantity"],
                   price=item["price"]
             )
        serializer = OrderSerializer(order)
        return Response(serializer.data, status=201)
   except Exception as e:
        return Response({"error": str(e)}, status=400)


class CustomerRegisterView(generics.CreateAPIView):
   serializer_class = CustomerRegistrationSerializer
   permission_classes = [AllowAny]




class StaffRegistrationView(APIView):
   permission_classes = [IsAdminUser]  # Only superusers


   def post(self, request):
       serializer = StaffSerializer(data=request.data)
       if serializer.is_valid():
           user = serializer.save()
           return Response({"message": "Staff registered", "user_id": user.id}, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class AdminRegistrationView(APIView):
   permission_classes = [IsAdminUser]  # Only superusers


   def post(self, request):
       serializer = AdminUserSerializer(data=request.data)
       if serializer.is_valid():
           user = serializer.save()
           return Response({"message": "Admin registered", "user_id": user.id}, status=status.HTTP_201_CREATED)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




class CustomLoginView(TokenObtainPairView):
   serializer_class = CustomLoginSerializer
          
class CustomLoginAPIView(APIView):
   def post(self, request):
       serializer = CustomLoginSerializer(data=request.data)
       if serializer.is_valid():
           return Response(serializer.validated_data, status=status.HTTP_200_OK)
       return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MenuCategoryViewSet(viewsets.ModelViewSet):
   queryset = MenuCategory.objects.all()
   serializer_class = MenuCategorySerializer
   permission_classes = [IsAuthenticatedOrReadOnly]


class MenuItemViewSet(viewsets.ModelViewSet):
   queryset = MenuItem.objects.all()
   serializer_class = MenuItemSerializer
   permission_classes = [IsAuthenticatedOrReadOnly]


class OrderViewSet(viewsets.ModelViewSet):
   queryset = Order.objects.all().order_by('-created_at')
   serializer_class = OrderSerializer
   permission_classes = [AllowAny]


   @action(detail=False, methods=["post"], url_path="send_whatsapp_message")
   def send_whatsapp_message_api(self, request):
         order_id = request.data.get("order_id")
         if not order_id:
               return Response({"error": "Order ID is required."}, status=400)
         try:
               order = Order.objects.get(id=order_id)
         except Order.DoesNotExist:
               return Response({"error": "Order not found."}, status=404)
         receipt_text = build_whatsapp_receipt(order)
         send_result = send_whatsapp_message(order.customer.phone_number, receipt_text)
         if send_result:
               return Response({"success": True, "message": receipt_text})
         else:
               return Response({"success": False, "error": "Failed to send WhatsApp message."}, status=500)


   def perform_create(self, serializer, customer):
        serializer.save(customer=customer)


   def create(self, request, *args, **kwargs):
        data = request.data
        name = data.get("customer_name")
        phone = data.get("customer_phone")
        email = data.get("customer_email")
        address = data.get("customer_address")
        if not phone:
             return Response({"error": "Phone number is required"}, status=400)
        customer = CustomerProfile.objects.filter(phone_number=phone).first()
        if not customer:
             user = User.objects.create(username=phone)
             customer = CustomerProfile.objects.create(
                   user=user,
                   phone_number=phone,
                   email=email,
                   name=name,
                   address=address
             )
        else:
             customer.name = name
             customer.email = email
             customer.address = address
             customer.save()
        order_data = {
             "status": data.get("status", "pending"),
             "total_amount": data.get("total_amount", 0),
             "is_online": True,
             "items": data.get("items", [])
        }
        serializer = self.get_serializer(data=order_data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(customer=customer)
        if order.status == "pending":
               award_loyalty_points(order)
               logger.info(f"New Order created: {order.id} for customer {customer.id} and awarded loyalty points.")
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class OrderItemViewSet(viewsets.ModelViewSet):
   queryset = OrderItem.objects.all()
   serializer_class = OrderItemSerializer
   permission_classes = [AllowAny]


class InventoryItemViewSet(viewsets.ModelViewSet):
   queryset = InventoryItem.objects.all()
   serializer_class = InventoryItemSerializer
   permission_classes = [IsAuthenticated]


class FeedbackViewSet(viewsets.ModelViewSet):
   queryset = Feedback.objects.all()
   serializer_class = FeedbackSerializer
   permission_classes = [AllowAny]
   throttle_classes = [FeedbackRateThrottle]
   def perform_create(self, serializer, customer):
        serializer.save(customer=customer)
        logger.info(f"New Feedback received: from {feedback.customer_id}")


class LoyaltyPointHistoryViewSet(viewsets.ModelViewSet):
   queryset = LoyaltyPointHistory.objects.all()
   serializer_class = LoyaltyPointHistorySerializer
   permission_classes = [AllowAny]


class OfferViewSet(viewsets.ModelViewSet):
   queryset = Offer.objects.all()
   serializer_class = OfferSerializer
   permission_classes = [IsAuthenticatedOrReadOnly]


class ReferralViewSet(viewsets.ModelViewSet):
   queryset = Referral.objects.all()
   serializer_class = ReferralSerializer
   permission_classes = [AllowAny]


class EmployeeViewSet(viewsets.ModelViewSet):
   queryset = Employee.objects.all()
   serializer_class = EmployeeSerializer
   permission_classes = [IsAuthenticated]


class DailySalesSummaryViewSet(viewsets.ModelViewSet):
   queryset = DailySalesSummary.objects.all()
   serializer_class = DailySalesSummarySerializer
   permission_classes = [IsAuthenticated]