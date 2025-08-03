from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
   CustomerProfileViewSet,
   lookup_customer,
   register_customer,
   CustomerLookupCreateView,
   guest_profile,
   check_phone_number_exists,
   get_total_loyalty_points,
)


router = DefaultRouter()
router.register("customers", CustomerProfileViewSet)


urlpatterns = [
   path("customers/lookup/", lookup_customer),
   path("customers/check-phone/", check_phone_number_exists),
   #path("register/", register_customer),
   path("customers/lookup-or-create/", CustomerLookupCreateView.as_view()),
   path("customers/guest/", guest_profile),
   path("loyalty/total/<int:customer_id>/", get_total_loyalty_points),
   path("", include(router.urls)),
]
