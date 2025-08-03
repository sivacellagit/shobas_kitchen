# customers/serializers.py
from rest_framework import serializers
from .models import CustomerProfile
from django.contrib.auth.models import User


class CustomerProfileSerializer(serializers.ModelSerializer):
   username = serializers.CharField(source='user.username', read_only=True)
   phone_number = serializers.CharField(source='user.phone_number', read_only=True)


   class Meta:
       model = CustomerProfile
       fields = [
           'id', 'username', 'customer_id', 'name', 'phone_number', 'email', 'address',
           'date_of_birth', 'wedding_date', 'joining_date', 'loyalty_points'
       ]
