from rest_framework import serializers


class SendOTPSerializer(serializers.Serializer):
   phone_number = serializers.CharField()


   def validate_phone_number(self, value):
       if not value.isdigit() or len(value) not in [10, 12, 13, 15]:
           raise serializers.ValidationError("Enter a valid phone number.")
       return value


class VerifyOTPSerializer(serializers.Serializer):
   phone_number = serializers.CharField()
   otp = serializers.CharField(min_length=4, max_length=6)


   def validate(self, data):
       if not data["phone_number"].isdigit():
           raise serializers.ValidationError("Invalid phone number.")
       if not data["otp"].isdigit():
           raise serializers.ValidationError("Invalid OTP.")
       return data


class PasswordLoginSerializer(serializers.Serializer):
   phone_number = serializers.CharField()
   password = serializers.CharField()