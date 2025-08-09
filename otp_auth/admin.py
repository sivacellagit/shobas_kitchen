from django.contrib import admin
from .models import OTPRequest, OTPVerification

@admin.register(OTPRequest)
class OTPRequestAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'otp', 'is_verified', 'created_at', 'expires_at')
    search_fields = ('phone_number', 'otp')
    list_filter = ('is_verified',)

@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ('phone_number', 'otp', 'created_at', 'attempts')
    search_fields = ('phone_number', 'otp')
