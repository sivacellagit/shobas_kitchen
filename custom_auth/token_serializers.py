# shobas_kitchen/custom_auth/token_serializers.py
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
   @classmethod
   def get_token(cls, user):
       token = super().get_token(user)
       # Add custom claims
       token["role"] = "admin" if user.is_superuser else (
           "staff" if user.is_staff else "customer"
       )
       token["username"] = user.username
       return token