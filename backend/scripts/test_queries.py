import os
from app import create_app
from app.extensions import db
from app.models import Drink, Order, Table, OrderItem
import uuid

app = create_app()

table = Table.query.filter_by(number=5).first()
orders = table.orders.filter_by(status='pending').all()

print(f"Orders for table {table.number}:")
for order in orders:
    print(f"Order ID: {order.id}, Status: {order.status}, Locked Price Used: {order.locked_price_used}")
    for item in order.items:
        print(f"  Drink: {item.drink.name}, Quantity: {item.quantity}, Unit Price: {item.unit_price}, Total Price: {item.total_price}")
    print(f"Total Order Price: {order.total_price}")

