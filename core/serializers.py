from rest_framework import serializers
from customers.serializers import CustomerProfileSerializer
from django.contrib.auth import get_user_model
from .models import (
   CustomUser,
   MenuCategory,
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


User = get_user_model()


class CustomUserSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ['id', 'username', 'email', 'phone_number', 'first_name', 'last_name', 'is_staff', 'is_superuser']


class CustomLoginSerializer(TokenObtainPairSerializer):
   username_field = 'username'  # Placeholder, we'll override validate()


   def validate(self, attrs):
       login = attrs.get("username")
       password = attrs.get("password")


       user_obj = User.objects.filter(email__iexact=login).first() or \
                  User.objects.filter(phone_number__iexact=login).first()


       if user_obj and user_obj.check_password(password):
           data = super().get_token(user_obj)
           return {
               'refresh': str(data),
               'access': str(data.access_token),
               'user': CustomUserSerializer(user_obj).data
           }
       raise serializers.ValidationError(_("Invalid credentials"))


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