import os
from app import create_app
from app.extensions import db
from app.models import Drink, Order, Table, OrderItem, PriceHistory
from app.models.order_item import ItemStatus

import uuid

def init_db():
    app = create_app()
    with app.app_context():
        # Create the database tables
        db.create_all()

        # Add initial data if needed
        drinks = [
            Drink(name='Mojito', price=2.50),
            Drink(name='Beer', price=3.00),
            Drink(name='Margarita', price=3.50)
        ]
        
        print("Sample drinks added to the database.")
        # Populate initial data for tables if they are empty
        tables = [
            Table(number=1),
            Table(number=2),
            Table(number=3),
            Table(number=4),
            Table(number=5),
        ]
        db.session.bulk_save_objects(tables)
        print("Sample tables added to the database.")
        
        table = Table.query.filter_by(number=5).first()
        new_order = Order(
            table=table,
            status='pending'
        )
        for drink in drinks:
            item = OrderItem(drink=drink, quantity=2, unit_price=drink.price, order=new_order, locked_price_used=False)
            new_order.items.append(item)
            print(f"Price history for {drink.name} added with price {drink.price} and quantity {item.quantity}.")
        new_order.calculate_total()
        
        db.session.add(new_order)
        db.session.commit()
        print("Sample order with items added to the database.")
        

if __name__ == '__main__':
    init_db()
    print("Database initialization script executed.")