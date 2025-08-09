from django.urls import path
from .views import SendOTPView, VerifyOTPView, PasswordLoginView, send_otp_view


urlpatterns = [
   path("send-otp/", SendOTPView.as_view()),
   #path("send-otp/",send_otp_view),
   path("verify-otp/", VerifyOTPView.as_view()),
   path("password-login/", PasswordLoginView.as_view()),
]
