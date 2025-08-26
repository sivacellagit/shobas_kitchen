from rest_framework import serializers
from customers.serializers import CustomerProfileSerializer
from django.contrib.auth import get_user_model
from .models import (
   CustomUser,
   Staff,
   Branch,
   MenuCategory,
   Config,
   MenuItem,
   Order,
   OrderItem,
   InventoryItem,
   Offer,
   Referral,
   Employee,
   Feedback,
   LoyaltyPointHistory,
   DailySalesSummary
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from customers.models import CustomerProfile
from rest_framework_simplejwt.tokens import RefreshToken
import logging

logger = logging.getLogger(__name__)

User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ['id', 'username', 'email', 'phone_number', 'first_name', 'last_name', 'is_staff', 'is_superuser', "role"]

   def get_role(self, obj):
        logger.info(f"Getting role for user: {obj.username} - is_staff: {obj.is_staff}, is_superuser: {obj.is_superuser}")
        
        if obj.is_superuser:
            return "admin"
        elif obj.is_staff:
            return "staff"
        return "customer"

#class CustomLoginSerializer(TokenObtainPairSerializer):
#   username_field = 'username'  # Placeholder, we'll override validate()

#  def validate(self, attrs):
#       login = attrs.get("username")
#       password = attrs.get("password")

#       user_obj = User.objects.filter(email__iexact=login).first() or \
#                  User.objects.filter(phone_number__iexact=login).first()


#       if user_obj and user_obj.check_password(password):
#           data = super().get_token(user_obj)
#           return {
#               'refresh': str(data),
#               'access': str(data.access_token),
#               'user': CustomUserSerializer(user_obj).data
#           }
#       raise serializers.ValidationError(_("Invalid credentials"))

class CustomLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")

        # allow login with email or username
        try:
            if "@" in username:
                user_obj = User.objects.get(email=username)
                username = user_obj.username
            else:
                user_obj = User.objects.get(username=username)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid username or password")

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError("Invalid username or password")

        refresh = RefreshToken.for_user(user)

        # determine role
        if user.is_superuser:
            role = "admin"
        elif user.is_staff:
            role = "staff"
        else:
            role = "customer"

        return {
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "phone_number": getattr(user, "phone_number", ""),
                "first_name": user.first_name,
                "last_name": user.last_name,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "role": role,  # ✅ add role here
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }

class CustomerRegistrationSerializer(serializers.ModelSerializer):
   name = serializers.CharField(write_only=True)


   class Meta:
       model = User
       fields = ['id', 'username', 'email', 'phone_number', 'password', 'name']
       extra_kwargs = {
           'password': {'write_only': True},
           'username': {'required': False},
       }


   def create(self, validated_data):
       name = validated_data.pop('name')
       user = User.objects.create_user(
           username=validated_data.get('username') or validated_data['phone_number'],
           email=validated_data.get('email'),
           phone_number=validated_data['phone_number'],
           password=validated_data['password'],
           role='customer',
       )


       CustomerProfile.objects.create(user=user, name=name)
       return user


class StaffSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ['id', 'username', 'email', 'phone_number', 'role']
       read_only_fields = ['role']


   def create(self, validated_data):
       user = User.objects.create_user(
           username=validated_data['phone_number'],
           email=validated_data.get('email'),
           phone_number=validated_data['phone_number'],
           password=User.objects.make_random_password(),
           role='staff',
       )
       return user
      
class AdminUserSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ['id', 'username', 'email', 'phone_number', 'role']
       read_only_fields = ['role']


   def create(self, validated_data):
       user = User.objects.create_superuser(
           username=validated_data['phone_number'],
           email=validated_data.get('email'),
           phone_number=validated_data['phone_number'],
           password=User.objects.make_random_password(),
           role='admin',
       )
       return user


class MenuCategorySerializer(serializers.ModelSerializer):
   class Meta:
       model = MenuCategory
       fields = '__all__'


class MenuItemSerializer(serializers.ModelSerializer):
   category_name = serializers.CharField(source='category.name', read_only=True)


   class Meta:
       model = MenuItem
       fields = ['id', 'name', 'price', 'image', 'category', 'category_name']


   def get_image(self, obj):
       return obj.image.url if obj.image else ""


class MenuItemSimpleSerializer(serializers.ModelSerializer):
   class Meta:
       model = MenuItem
       fields = ['id', 'name', 'price']


class OrderItemSerializer(serializers.ModelSerializer):
   item = serializers.PrimaryKeyRelatedField(queryset=MenuItem.objects.all(), write_only=True)
   item_detail = MenuItemSimpleSerializer(source='item', read_only=True)


   class Meta:
       model = OrderItem
       fields = ['item', 'item_detail', 'quantity', 'price']


class OrderSerializer(serializers.ModelSerializer):
   customer = CustomerProfileSerializer(read_only=True)
   items = OrderItemSerializer(many=True)


   class Meta:
       model = Order
       fields = ['id', 'customer', 'status', 'total_amount', 'is_online', 'created_at', 'items']


   def create(self, validated_data):
       items_data = validated_data.pop('items')
       order = Order.objects.create(**validated_data)
       for item_data in items_data:
           OrderItem.objects.create(order=order, **item_data)
       return order


class InventoryItemSerializer(serializers.ModelSerializer):
   class Meta:
       model = InventoryItem
       fields = '__all__'


class FeedbackSerializer(serializers.ModelSerializer):
   class Meta:
       model = Feedback
       fields = '__all__'


class LoyaltyPointHistorySerializer(serializers.ModelSerializer):
   class Meta:
       model = LoyaltyPointHistory
       fields = '__all__'


class OfferSerializer(serializers.ModelSerializer):
   class Meta:
       model = Offer
       fields = '__all__'


class ReferralSerializer(serializers.ModelSerializer):
   class Meta:
       model = Referral
       fields = '__all__'


class EmployeeSerializer(serializers.ModelSerializer):
   class Meta:
       model = Employee
       fields = '__all__'


class DailySalesSummarySerializer(serializers.ModelSerializer):
   class Meta:
       model = DailySalesSummary
       fields = '__all__'