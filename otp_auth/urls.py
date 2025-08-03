from django.urls import path
from .views import SendOTPView, VerifyOTPView, PasswordLoginView


urlpatterns = [
   path("send-otp/", SendOTPView.as_view()),
   path("verify-otp/", VerifyOTPView.as_view()),
   path("password-login/", PasswordLoginView.as_view()),
]
