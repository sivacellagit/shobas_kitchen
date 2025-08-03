from django.contrib import admin

# Register your models here.
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin


from .models import (
   MenuCategory, MenuItem, Order, OrderItem,
   InventoryItem, Feedback, LoyaltyPointHistory, Offer, Referral,
   Employee, DailySalesSummary, Config, CustomUser
)


from customers.models import CustomerProfile


class CustomUserAdmin(UserAdmin):
   model = CustomUser
   fieldsets = UserAdmin.fieldsets + (
       ('Additional Info', {'fields': ('phone_number',)}),
   )
   add_fieldsets = UserAdmin.add_fieldsets + (
       ('Additional Info', {'fields': ('phone_number',)}),
   )
   list_display = ('username', 'email', 'phone_number', 'is_staff', 'is_active')


class OrderAdmin(admin.ModelAdmin):
   list_display = ['id', 'customer', 'status', 'total_amount', 'is_online', 'created_at']  # 👈 Add created_at here
   list_filter = ['status', 'is_online', 'created_at']
   readonly_fields = ('created_at',)
   search_fields = ['customer__user__username', 'id']
   ordering = ['-created_at']  # Optional: shows newest first


# Register your models here.


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(MenuCategory)
admin.site.register(MenuItem)
admin.site.register(CustomerProfile)
admin.site.register(Order, OrderAdmin)
admin.site.register(OrderItem)
admin.site.register(InventoryItem)
admin.site.register(Feedback)
admin.site.register(Employee)
admin.site.register(LoyaltyPointHistory)
admin.site.register(Offer)
admin.site.register(DailySalesSummary)
admin.site.register(Referral)
admin.site.register(Config)
