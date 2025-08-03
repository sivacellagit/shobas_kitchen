# utils/whatsapp.py
from datetime import timezone
from django.utils import timezone


def build_whatsapp_receipt(order):
   customer = order.customer
   items_text = ""
   for oi in order.items.all():
       item_name = oi.item.name if oi.item else "Unknown Item"
       items_text += f"• {item_name} x {oi.quantity} - ₹{int(float(oi.price))} = ₹{int(float(oi.price) * float(oi.quantity))}\n"


   created_date = timezone.localtime(order.created_at).strftime('%d %B %Y, %-I:%M %p')


   # Example: discount values (you can adjust based on logic)
   first_order_discount = getattr(order, 'first_order_discount', 0)
   total_amount = float(order.total_amount)
   final_amount = total_amount - first_order_discount


   receipt = f"""🍛 *Shoba's Kitchen - Curry Club*


✅ *Order Confirmation*


🧑‍🍳 Name: {customer.name}
📞 Phone: +91 {customer.phone_number}
🧾 Order ID: #ORD{order.id:04d}
📅 Date: {created_date}


🛍️ Items:
{items_text}
💰 Subtotal: ₹{int(total_amount)}
🎁 Discount: ₹{int(first_order_discount)}
🔢 Total: ₹{int(final_amount)}


🧾 Thank you for ordering with us!
📍 Visit again: www.shobaskitchen.in
"""
   return receipt