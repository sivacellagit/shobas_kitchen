# otp_auth/models.py


from django.db import models
from django.utils import timezone
import uuid
from datetime import timedelta


class OTPRequest(models.Model):
   id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
   phone_number = models.CharField(max_length=15)
   otp = models.CharField(max_length=6)
   is_verified = models.BooleanField(default=False)
   created_at = models.DateTimeField(auto_now_add=True)
   expires_at = models.DateTimeField()


   def is_expired(self):
       return timezone.now() > self.expires_at


   def __str__(self):
       return f"{self.phone_number} - OTP {self.otp} - Verified: {self.is_verified}"


class OTPVerification(models.Model):
   phone_number = models.CharField(max_length=20)
   otp = models.CharField(max_length=6)
   created_at = models.DateTimeField(auto_now_add=True)
   attempts = models.IntegerField(default=0)


   def is_expired(self):
       return timezone.now() > self.created_at + timedelta(minutes=5)  # OTP valid for 5 mins


   def is_rate_limited(self):
       return self.attempts >= 3  # Allow max 3 OTP requests within cooldown period