# shobas_kitchen/custom_auth/token_views.py
from rest_framework_simplejwt.views import TokenObtainPairView
from .token_serializers import CustomTokenObtainPairSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
   serializer_class = CustomTokenObtainPairSerializer