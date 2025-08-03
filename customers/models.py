from django.db import models

# Create your models here.
#shobas_kitchen/customers/models.py
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.conf import settings
#from core.models import Order


# --- Customer Profile ---
class CustomerProfile(models.Model):
   user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
   customer_id = models.CharField(max_length=12, unique=True, editable=False, blank=True)
   name = models.CharField(max_length=100, default="Guest")
   address = models.TextField(blank=True, default="") 
   #phone_number = models.CharField(max_length=15, unique=True)
   email = models.CharField(max_length=100, null=True, blank=True)
   date_of_birth = models.DateField(null=True, blank=True)
   wedding_date = models.DateField(null=True, blank=True)
   joining_date = models.DateTimeField(default=timezone.now)
   loyalty_points = models.PositiveIntegerField(default=0)
   base_branch = models.CharField(max_length=100, default="Main Branch")


   def save(self, *args, **kwargs):
       if not self.customer_id:
           self.customer_id = f"SK{uuid.uuid4().hex[:10].upper()}"  # example: SKA1B2C3D4E
       super().save(*args, **kwargs)


   @property
   def total_loyalty_points(self):
       return self.loyaltypointhistory_set.aggregate(total=models.Sum('points'))["total"] or 0


   def __str__(self):
       return f"{self.user.username} ({self.customer_id})"