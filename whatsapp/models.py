# models.py
from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid

class WhatsAppOptIn(models.Model):
    """Track customers who have opted in to receive WhatsApp messages."""
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='whatsapp_optins')
    phone_number = models.CharField(max_length=32, help_text='E.164 format, e.g. 919876543210')
    opted_in = models.BooleanField(default=False)
    opted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'phone_number')

    def opt_in(self):
        self.opted_in = True
        self.opted_at = timezone.now()
        self.save()

class WhatsAppOTP(models.Model):
    """Store OTPs for phone-based login/verification."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone_number = models.CharField(max_length=32)
    otp = models.CharField(max_length=8)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    verified = models.BooleanField(default=False)

    class Meta:
        indexes = [
            models.Index(fields=['phone_number']),
        ]

    def is_valid(self):
        return (not self.verified) and (timezone.now() <= self.expires_at)