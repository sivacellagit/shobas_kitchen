from django.shortcuts import render

# Create your views here.
# File: /shobas_kitchen/customers/views.py


from django.db import models
from rest_framework import viewsets, generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
#from django.contrib.auth.models import User
import logging
from .models import CustomerProfile
from .serializers import CustomerProfileSerializer
#from core.serializers LoyaltyPointHistorySerializer, FeedbackSerializer
from .awards import award_loyalty_points, award_loyalty_points_for_feedback
from core.models import LoyaltyPointHistory
from django.contrib.auth import get_user_model

User = get_user_model()


# --- Authenticated Customer Profile ViewSet (for admin/staff use only) ---
class CustomerProfileViewSet(viewsets.ModelViewSet):
   queryset = CustomerProfile.objects.all()
   serializer_class = CustomerProfileSerializer


   def get_permissions(self):
       if self.action == 'create':
           return [AllowAny()]
       return super().get_permissions()


   def create(self, request, *args, **kwargs):
       phone = request.data.get("phone_number")
       name = request.data.get("name", "Guest")
       address = request.data.get("address", "")
       email = request.data.get("email","")
       dob = request.data.get("date_of_birth") or None
       wedding = request.data.get("wedding_date") or None


       if not phone or not name:
           return Response({"error": "Name and phone number are required"}, status=status.HTTP_400_BAD_REQUEST)


       # Check if user already exists
       if User.objects.filter(username=phone).exists():
           return Response({"error": "User with this phone number already exists"}, status=status.HTTP_400_BAD_REQUEST)


       user = User.objects.create_user(username=phone, phone_number=phone, password="temp123")
       customer = CustomerProfile.objects.create(
           user=user,
           name=name,
           #phone_number=phone,
           email=email,
           address=address,
           date_of_birth=dob,
           wedding_date=wedding,
       )
       serializer = self.get_serializer(customer)
       return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
def check_phone_number_exists(request):
   phone = request.GET.get("phone")
   if not phone:
       return Response({"error": "Phone number is required."}, status=400)
  
   exists = CustomerProfile.objects.filter(user__phone_number=phone).exists()
   return Response({"exists": exists})
  
# --- Public API to lookup customer by phone ---
@api_view(['GET'])
@permission_classes([AllowAny])
def lookup_customer(request):
   phone = request.GET.get("phone")
   if not phone:
       return Response({"error": "Phone number required"}, status=status.HTTP_400_BAD_REQUEST)


   try:
       customer = CustomerProfile.objects.get(user__phone_number=phone)
       serializer = CustomerProfileSerializer(customer)
       return Response(serializer.data)
   except CustomerProfile.DoesNotExist:
       return Response({"detail": "Customer not found"}, status=status.HTTP_404_NOT_FOUND)


# --- Public API to register a new customer ---
@api_view(['POST'])
@permission_classes([AllowAny])
def register_customer(request):
  data = request.data
  phone = data.get("phone")
  name = data.get("name", "Guest")
  email = data.get("email","")
  address = data.get("address", "")
  dob = data.get("dateOfBirth")
  wedding = data.get("weddingDate")

  if not phone:
      return Response({"error": "Phone is required"}, status=400)

  user = User.objects.create_user(username=phone, phone_number=phone, password="temp123")
  customer = CustomerProfile.objects.create(
      user=user,
      name=name,
      #phone_number=phone,
      email=email,
      address=address,
      date_of_birth=dob,
      wedding_date=wedding,
  )
 
  serializer = CustomerProfileSerializer(customer)
  return Response(serializer.data, status=201)


@api_view(["GET"])
@permission_classes([AllowAny])
def guest_profile(request):
   try:
       guest_user = User.objects.get(username="guest")
       guest_customer = CustomerProfile.objects.get(user=guest_user)
       serializer = CustomerProfileSerializer(guest_customer)
       return Response(serializer.data)
   except (User.DoesNotExist, CustomerProfile.DoesNotExist):
       return Response({"detail": "Guest profile not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def get_loyalty_points(request):
   customer_id = request.query_params.get("customer_id")
   customer = CustomerProfile.objects.get(id=customer_id)
   total_points = customer.loyaltypointhistory_set.aggregate(total=models.Sum('points'))["total"] or 0
   return Response({"points": total_points, "redeemable_rupees": total_points // 100})


@api_view(["GET"])
def get_total_loyalty_points(request, customer_id):
   try:
       customer = CustomerProfile.objects.get(id=customer_id)
       total_points = LoyaltyPointHistory.objects.filter(customer=customer).aggregate(
           total=models.Sum("points")
       )["total"] or 0
       return Response({"customer_id": customer_id, "total_points": total_points})
   except CustomerProfile.DoesNotExist:
       return Response({"error": "Customer not found."}, status=404)


# --- GenericAPIView supporting both GET and POST ---
class CustomerLookupCreateView(generics.GenericAPIView):
   serializer_class = CustomerProfileSerializer
   permission_classes = [AllowAny]


   def get(self, request):
       phone = request.query_params.get('phone')
       if not phone:
           return Response({"error": "Phone number is required"}, status=400)
       try:
           customer = CustomerProfile.objects.get(phone_number=phone)
           serializer = self.get_serializer(customer)
           return Response(serializer.data)
       except CustomerProfile.DoesNotExist:
           return Response({"detail": "Customer not found"}, status=404)


   def post(self, request):
       phone = request.data.get("phone_number")
       name = request.data.get("name")
       address = request.data.get("address", "")
       email = request.data.get("email","")
       date_of_birth = request.data.get("date_of_birth")
       wedding_date = request.data.get("wedding_date")


       if not phone or not name:
           return Response({"error": "Name and phone number are required"}, status=400)


       user = User.objects.create(username=phone)
       profile = CustomerProfile.objects.create(
           user=user,
           name=name,
           phone_number=phone,
           email = email,
           address=address,
           date_of_birth=date_of_birth,
           wedding_date=wedding_date,
       )
       serializer = self.get_serializer(profile)
       return Response(serializer.data, status=201)


def submit_feedback(request):
   # ... your feedback saving logic here ...
   feedback = form.save()
   award_loyalty_points_for_feedback(feedback)
