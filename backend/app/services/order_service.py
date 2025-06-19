from app.extensions import db
from app.models.order import Order
import uuid

class OrderService:
    @staticmethod
    def create_order(locked_price_used=False):
        order = OrderService._create_transaction(
            # TODO: Add user_id,drink, OrderItem when user management is implemented
            status='pending',
            locked_price_used=locked_price_used
        )
        return order
    
    @staticmethod
    def get_all_orders():
        """Get all orders from the database."""
        try:
            orders = Order.query.all()
            return orders
        except Exception as e:
            raise Exception(f"Error fetching orders: {str(e)}")

    @staticmethod
    def _create_transaction(status='pending', locked_price_used=False):
        order = Order(
            id=uuid.uuid4(),  # Generate a new UUID for the order
            status=status,
            locked_price_used=locked_price_used
        )
        db.session.add(order)
        db.session.commit()
        return order