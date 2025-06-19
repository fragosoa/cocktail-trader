import os
from app import create_app
from app.extensions import db
from app.models import Drink, Order

def init_db():
    app = create_app()
    with app.app_context():
        # Create the database tables
        db.create_all()

        # Add initial data if needed
        if not Drink.query.first():
            drinks = [
                Drink(name='Espresso', price=2.50),
                Drink(name='Latte', price=3.00),
                Drink(name='Cappuccino', price=3.50),
            ]
            db.session.bulk_save_objects(drinks)
            db.session.commit()

        print("Database initialized and sample data added.")

if __name__ == '__main__':
    init_db()
    print("Database initialization script executed.")