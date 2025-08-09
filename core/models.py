import uuid
from django.db import models
from django.contrib.auth.models import User, AbstractUser
from django.utils import timezone
#from customers.models import CustomerProfile


# --- Customer Profile ---
class CustomUser(AbstractUser):
   ROLE_CHOICES = [
       ('customer', 'Customer'),
       ('staff', 'Staff'),
       ('admin', 'Admin'),
   ]

   phone_number = models.CharField(max_length=20, unique=True)
   role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')


   def __str__(self):
       return self.username or self.phone_number


# --- Branch Details ---
class Branch(models.Model):
   name = models.CharField(max_length=100)
   location = models.TextField()
   is_active = models.BooleanField(default=True)


   def __str__(self):
       return self.name


# --- Staff Data ---
class Staff(models.Model):
   ROLE_CHOICES = [
       ("manager", "Manager"),
       ("cashier", "Cashier"),
       ("chef", "Chef"),
       ("assistant", "Assistant"),
       ("delivery", "Delivery"),
   ]


   user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
   role = models.CharField(max_length=20, choices=ROLE_CHOICES)
   branches = models.ManyToManyField('Branch')  # Assigned to one or more branches
   joining_date = models.DateField()
   total_experience = models.DecimalField(max_digits=4, decimal_places=1)  # In years
   skills = models.TextField(blank=True)
   emergency_contact = models.CharField(max_length=15)
   address = models.TextField(blank=True)


   is_active = models.BooleanField(default=True)


   def __str__(self):
       return f"{self.user.get_full_name()} - {self.role}"


# --- Discount Configuration ---
class Config(models.Model):
   key = models.CharField(max_length=100, unique=True)
   value = models.CharField(max_length=255)
   description = models.TextField(blank=True, null=True)


   def __str__(self):
       return f"{self.key}: {self.value}"


   @staticmethod
   def get_config_value(key: str, default: float = 10.0) -> float:
       try:
           config = Config.objects.get(key=key)
           return float(config.value)
       except Config.DoesNotExist:
           return default


# --- Menu Category ---
class MenuCategory(models.Model):
   name = models.CharField(max_length=100)
   description = models.TextField(blank=True)


   def __str__(self):
       return self.name


# --- Menu Item ---
class MenuItem(models.Model):
   name = models.CharField(max_length=100)
   category = models.ForeignKey(MenuCategory, on_delete=models.CASCADE)
   price = models.DecimalField(max_digits=8, decimal_places=2)
   image = models.ImageField(upload_to='menu_images/', blank=True, null=True)
   description = models.TextField(blank=True)
   is_available = models.BooleanField(default=True)


   def __str__(self):
       return self.name


# --- Order ---
class Order(models.Model):
   customer = models.ForeignKey("customers.CustomerProfile", on_delete=models.SET_NULL, null=True, blank=True)
   created_at = models.DateTimeField(auto_now_add=True)
   status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('completed', 'Completed'), ('cancelled', 'Cancelled')])
   total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
   is_online = models.BooleanField(default=False)  # POS or Online
   is_first_order_discount_applied = models.BooleanField(default=False)


   class Meta:
       ordering = ['-created_at']


   def __str__(self):
       return f"Order #{self.id}"


# --- Order Item ---
class OrderItem(models.Model):
   order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
   item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
   quantity = models.PositiveIntegerField(default=1)
   price = models.DecimalField(max_digits=8, decimal_places=2)
#   received_first_time_item_discount = models.BooleanField(default=False)


   def __str__(self):
       return f"{self.item} x {self.quantity}"


# --- Inventory Item ---
class InventoryItem(models.Model):
   name = models.CharField(max_length=100)
   quantity = models.PositiveIntegerField()
   unit = models.CharField(max_length=50)  # e.g., kg, l, pcs
   reorder_level = models.PositiveIntegerField(default=10)


   def __str__(self):
       return self.name


# --- Employee ---
class Employee(models.Model):
   name = models.CharField(max_length=100)
   role = models.CharField(max_length=50)
   contact = models.CharField(max_length=15)


   def __str__(self):
       return self.name


class Feedback(models.Model):
   id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
   customer = models.ForeignKey("customers.CustomerProfile", on_delete=models.CASCADE)
   platform = models.CharField(max_length=50)  # Google, Zomato, etc.
   content = models.TextField()
   created_at = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       snippet = (self.content[:30] + '...') if len(self.content) > 30 else self.content
       return f"Feedback by {self.customer.user.username} on {self.platform}: \"{snippet}\""


# --- Loyalty History ---
class LoyaltyPointHistory(models.Model):
   customer = models.ForeignKey("customers.CustomerProfile", on_delete=models.CASCADE)
   date = models.DateTimeField(auto_now_add=True)
   points = models.IntegerField()  # positive or negative
   order = models.ForeignKey('Order', on_delete=models.SET_NULL, null=True, blank=True, related_name='loyalty_histories')
   feedback = models.ForeignKey('Feedback', on_delete=models.SET_NULL, null=True, blank=True, related_name='feedback_loyalty_histories')


   def __str__(self):
       assoc = []
       if self.order:
           assoc.append(f"Order #{self.order.id}")
       if self.feedback:
           assoc.append(f"Feedback #{self.feedback.id}")
       assoc_str = ", ".join(assoc) if assoc else "No association"
       return f"{self.points} points for {self.customer.user.username} ({assoc_str})"


# --- Referral ---
class Referral(models.Model):
   referrer = models.ForeignKey("customers.CustomerProfile", related_name='referrals_made', on_delete=models.CASCADE)
   referee = models.ForeignKey("customers.CustomerProfile", related_name='referred_by', on_delete=models.CASCADE)
   referred_on = models.DateTimeField(auto_now_add=True)


   def __str__(self):
       return f"{self.referrer} referred {self.referee}"


# --- Offer (e.g., birthday offers) ---
class Offer(models.Model):
   name = models.CharField(max_length=100)
   description = models.TextField()
   applicable_from = models.DateField()
   applicable_to = models.DateField()
   discount_percent = models.PositiveIntegerField()
   min_annual_spend = models.DecimalField(max_digits=10, decimal_places=2, default=0)


   def __str__(self):
       return self.name


# ---- DailySalesSummary -------
class DailySalesSummary(models.Model):
   date = models.DateField(unique=True)
   total_orders = models.PositiveIntegerField(default=0)
   total_revenue = models.DecimalField(max_digits=10, decimal_places=2)
   total_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
   profit = models.DecimalField(max_digits=10, decimal_places=2, editable=False)
   notes = models.TextField(blank=True, null=True)


   def save(self, *args, **kwargs):
       self.profit = self.total_revenue - self.total_cost
       super().save(*args, **kwargs)


   def __str__(self):
       return f"Sales Summary - {self.date}"