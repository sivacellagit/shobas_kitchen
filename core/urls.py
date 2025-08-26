from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from customers import views as customer_views
from .views import (
   test_logging,
   place_order,
   get_purchased_item_ids,
   get_discount_config,
   get_all_discount_configs
)
from utils.twilio_whatsapp import send_whatsapp_message
from otp_auth import urls as otp_auth_urls
from otp_auth.views import SendOTPView, VerifyOTPView, SecondStepLoginView, PasswordLoginView
from .views import (
   MenuCategoryViewSet, MenuItemViewSet,
   OrderViewSet, OrderItemViewSet, InventoryItemViewSet,
   FeedbackViewSet, EmployeeViewSet, LoyaltyPointHistoryViewSet,
   OfferViewSet, DailySalesSummaryViewSet, ReferralViewSet,
   get_discount_percent, CustomLoginAPIView
)
from customers.views import CustomerProfileViewSet, CustomerLookupCreateView, register_customer
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
   CustomerRegisterView,
   StaffRegistrationView,
   AdminRegistrationView,
   CustomLoginView,
   dashboard_stats
)


router = DefaultRouter()
router.register(r'menu-categories', MenuCategoryViewSet)
router.register(r'menu-items', MenuItemViewSet)
router.register(r'customers', customer_views.CustomerProfileViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'inventory', InventoryItemViewSet)
router.register(r'feedback', FeedbackViewSet)
router.register(r'employees', EmployeeViewSet)
#router.register(r'staff', StaffRegistrationView.as_view(), name='staff-registration')
router.register(r'loyalty-points', LoyaltyPointHistoryViewSet)
router.register(r'offers', OfferViewSet)
router.register(r'daily-sales', DailySalesSummaryViewSet)
router.register(r'referral', ReferralViewSet)


urlpatterns = [
  
   path("register/customer/", CustomerRegisterView.as_view(), name="register_customer"),
   path("register/staff/", StaffRegistrationView.as_view(), name="register_staff"),
   path("register/admin/", AdminRegistrationView.as_view(), name="register_admin"),
   #path("login/", CustomLoginView.as_view(), name="custom_login"),
   path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
   path('login/', CustomLoginAPIView.as_view(), name='custom-login'),
   path('orders/purchased-items/', get_purchased_item_ids, name='purchased-items'),
   #path("orders/send_whatsapp_message/", send_whatsapp_message),
   #path('orders/send_whatsapp_receipt/', get_purchased_item_ids, name='purchased-items'),
   path("config/discounts/", get_all_discount_configs, name="get_all_discount_configs"),
   path("config/first_time_discount_percent/", get_discount_percent),
   path('staff/', StaffRegistrationView.as_view(), name='staff-registration'),
   path('', include("customers.urls")),
   path('', include(router.urls)),
   path('', include("otp_auth.urls")),
   path("admin/dashboard-stats/", dashboard_stats, name="dashboard_stats"),
   #path("auth/login/", CustomLoginView.as_view(), name="token_obtain_pair"),
   path("auth/login/", CustomLoginAPIView.as_view(), name="custom_login"),
]


if settings.DEBUG:
   urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)