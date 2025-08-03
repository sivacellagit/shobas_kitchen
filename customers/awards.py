# File: /shobas_kitchen/customers/awards.py


from .models import CustomerProfile
from core.models import Order, Feedback, LoyaltyPointHistory


def award_loyalty_points(order):
   if not order.customer or order.status != "pending":
       return
   points = int(order.total_amount)
   if points > 0:
       LoyaltyPointHistory.objects.create(
           customer=order.customer,
           points=points,
           order=order
       )


def award_loyalty_points_for_feedback(feedback: Feedback):
   if not feedback or not feedback.customer:
       return
   points = 100
   LoyaltyPointHistory.objects.create(
       customer=feedback.customer,
       points=points,
       feedback=feedback
   )
