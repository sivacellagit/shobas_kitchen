from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import SendOTPSerializer, VerifyOTPSerializer, PasswordLoginSerializer
from .utils import generate_otp, send_otp
from django.core.cache import cache
from core.models import CustomUser
from customers.models import CustomerProfile
from .serializers import SendOTPSerializer, VerifyOTPSerializer
from .models import OTPRequest, OTPVerification
import random
from datetime import timedelta
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


@api_view(["POST"])
def send_otp_view(request):
   phone_number = request.data.get("phone_number")
   logger.info(f"Request to send OTP to phone: {phone_number}")
   if not phone_number:
       return Response({"error": "Phone number is required"}, status=status.HTTP_400_BAD_REQUEST)


   cooldown_threshold = timezone.now() - timedelta(minutes=1)
   recent_otp = OTPVerification.objects.filter(phone_number=phone_number).order_by("-created_at").first()
   logger.info(f"Recent OTP for {phone_number}: {recent_otp}")

   if recent_otp and recent_otp.created_at > cooldown_threshold:
       return Response({"error": "Please wait before requesting another OTP."}, status=429)
   try:
        user = CustomUser.objects.get(phone_number=phone_number)
        role = user.role
        is_registered = True
   except CustomUser.DoesNotExist:
        role = None
        is_registered = False

   otp = generate_otp()
   logger.info(f"Generated OTP: {otp} for phone: {phone_number}")
   send_otp(phone_number, otp)  # Twilio integrated here
   OTPVerification.objects.create(phone_number=phone_number, otp=otp)

   return Response({
        "message": "OTP sent",
        "role": role,
        "is_registered": is_registered
 })
   #return Response({"success": True, "message": "OTP sent."})

@api_view(['POST'])
def verify_otp(request):
    phone_number = request.data.get('phone_number')
    otp = request.data.get('otp')

    if not phone_number or not otp:
        return Response({"error": "Phone number and OTP are required"}, status=status.HTTP_400_BAD_REQUEST)

    if not verify_otp_code(phone_number, otp):
        return Response({"success": False, "message": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = CustomUser.objects.get(phone_number=phone_number)
        role = user.role
        is_registered = True
        token = create_jwt_for_user(user)
    except CustomUser.DoesNotExist:
        role = None
        is_registered = False
        token = None

    return Response({
        "success": True,
        "role": role,
        "is_registered": is_registered,
        "token": token
    })

class SendOTPView(APIView):
   def post(self, request):
       logger.info("Received request to send OTP")
       serializer = SendOTPSerializer(data=request.data)
       if serializer.is_valid():
           phone = serializer.validated_data['phone_number']
           otp = f"{random.randint(1000, 9999)}"
           expires_at = timezone.now() + timedelta(minutes=5)
           OTPRequest.objects.create(
               phone_number=phone,
               otp=otp,
               expires_at=expires_at
           )
           logger.info(f"OTP {otp} generated for phone {phone}")
           send_otp_view(request)
           # TODO: Integrate with SMS/WhatsApp gateway
           print(f"🔐 Sending OTP {otp} to {phone}")
           return Response({"message": "OTP sent successfully"}, status=200)
       return Response(serializer.errors, status=400)


class VerifyOTPView(APIView):
   def post(self, request):
       serializer = VerifyOTPSerializer(data=request.data)
       if serializer.is_valid():
           phone = serializer.validated_data['phone_number']
           otp = serializer.validated_data['otp']


           try:
               otp_record = OTPRequest.objects.filter(
                   phone_number=phone,
                   otp=otp,
                   is_verified=False
               ).latest('created_at')
           except OTPRequest.DoesNotExist:
               return Response({"error": "Invalid OTP"}, status=400)


           if otp_record.is_expired():
               return Response({"error": "OTP expired"}, status=400)


           otp_record.is_verified = True
           otp_record.save()


           # Check if user exists
           user = CustomUser.objects.filter(phone_number=phone).first()


           if not user:
               # Auto-register customer
               user = CustomUser.objects.create_user(
                   username=phone,
                   phone_number=phone,
                   password=CustomUser.objects.make_random_password(),
                   role='customer',
               )
               CustomerProfile.objects.create(user=user, name="")


           # Generate JWT token
           refresh = RefreshToken.for_user(user)


       if user.role in ['staff', 'admin']:
           # OTP verified but second login required
           return Response({
               "message": "OTP verified. Please proceed with secondary login.",
               "user": {
                   "id": user.id,
                   "phone_number": user.phone_number,
                   "role": user.role,
               },
               "second_step_required": True
           })


       # Else proceed as customer
       refresh = RefreshToken.for_user(user)


       return Response({
           "message": "OTP verified and user logged in",
           "user": {
               "id": user.id,
               "phone_number": user.phone_number,
               "role": user.role,
           },
           "access": str(refresh.access_token),
           "refresh": str(refresh),
           "second_step_required": False
       })


       return Response(serializer.errors, status=400)


class SecondStepLoginView(APIView):
   def post(self, request):
       phone = request.data.get('phone_number')
       password = request.data.get('password')


       user = CustomUser.objects.filter(phone_number=phone).first()


       if not user or not user.check_password(password):
           return Response({"error": "Invalid phone number or password"}, status=400)


       if user.role not in ['staff', 'admin']:
           return Response({"error": "This login is only for staff/admin"}, status=403)


       refresh = RefreshToken.for_user(user)


       return Response({
           "message": "Staff/Admin authenticated successfully",
           "user": {
               "id": user.id,
               "phone_number": user.phone_number,
               "role": user.role,
           },
           "access": str(refresh.access_token),
           "refresh": str(refresh)
       })


class PasswordLoginView(APIView):
   def post(self, request):
       serializer = PasswordLoginSerializer(data=request.data)
       serializer.is_valid(raise_exception=True)


       phone = serializer.validated_data["phone_number"]
       password = serializer.validated_data["password"]


       try:
           user = User.objects.get(phone_number=phone)
           if not user.check_password(password):
               raise Exception()
       except:
           return Response({"detail": "Invalid credentials"}, status=400)


       refresh = RefreshToken.for_user(user)
       return Response({
           "token": str(refresh.access_token),
           "refresh": str(refresh),
       })
