from rest_framework import serializers

class SendOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField()

class VerifyOTPSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    otp = serializers.CharField()

class SendReceiptSerializer(serializers.Serializer):
    order_id = serializers.IntegerField()
    phone_number = serializers.CharField()

class PromoSerializer(serializers.Serializer):
    title = serializers.CharField()
    template_name = serializers.CharField()
    user_ids = serializers.ListField(child=serializers.IntegerField(), required=False)
    # or send to phone numbers
    phone_numbers = serializers.ListField(child=serializers.CharField(), required=False)