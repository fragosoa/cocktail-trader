from app.extensions import db
from app.models.order import Order
from app.models.drink import Drink
from app.models.table import Table
from app.models.order_item import OrderItem
from app.models.price_history import PriceHistory
import app.extensions
import uuid
from flask import jsonify
import json
from confluent_kafka import KafkaException

class OrderService:
    @staticmethod
    def create_order(data):
        drinks = data.get('drinks')
        table_number = data.get('drinks')[0].get('table_number', 5)

        redis_client = app.extensions.redis_client
        if redis_client is None:
            return jsonify({'error': 'Redis client not initialized'}), 500
        
        drinks_to_process = []
        for drink in drinks:
            drink_id = drink.get('drink_id')
            quantity = drink.get('quantity', 1)
            if not drink_id or not quantity:
                raise Exception("Drink ID and quantity are required")
            redis_key = f"price_lock:{drink_id}"
            
            locked_price_used = False
            current_price = None
            if redis_client is not None:
                price = redis_client.get(redis_key)
                if price is not None:
                    try:
                        current_price = float(price)
                        locked_price_used = True
                    except Exception:
                        pass
            # If the price is not locked or not found in Redis, fetch from the database
            if current_price is None:
                drink = Drink.query.get(drink_id)
                if not drink:
                    raise Exception(f"Drink with id {drink_id} not found")
                current_price = drink.price
            
            drinks_to_process.append({
                'drink_id': drink_id,
                'quantity': quantity,
                'current_price': current_price,
                'locked_price_used': locked_price_used
            })
        order_manifest = {
            'table_number': table_number,
            'drinks': drinks_to_process
        }
        
        order = OrderService._create_transaction_async(order_manifest)
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
    def submit_transaction(order_details):
        
        table_number = order_details.get('table_number', 5)
        table = Table.query.filter_by(number=table_number).first()
        drinks = order_details.get('drinks', [])

        new_order = Order(
            table=table,
            status='pending'
        )
        for drink in drinks:
            drink_id = drink['drink_id']
            quantity = drink['quantity']
            current_price = drink['current_price']
            locked_price_used = drink['locked_price_used']
            
            item = OrderItem(
                drink_id=drink_id,
                quantity=quantity,
                unit_price=current_price,
                order=new_order,
                locked_price_used=locked_price_used
            )
            new_order.items.append(item)

            price_history = PriceHistory(
                drink_id=drink_id,
                price=current_price,
                quantity=quantity
            )
            db.session.add(price_history)
            
        new_order.calculate_total()
        db.session.add(new_order)
        db.session.commit()
        return jsonify({'drinks_list': drinks}), 200
    
    @staticmethod
    def _create_transaction_async(order_manifest):
        # Publicar mensaje de prueba en Kafka
        kafka_producer = app.extensions.kafka_producer
        
        if kafka_producer is None:
            return {'error': 'Kafka producer not initialized'}
        
        try:
            kafka_producer.produce('create_order', value=json.dumps(order_manifest).encode('utf-8'))
            kafka_producer.flush()
        except KafkaException as e:
            return jsonify({'error': f'Failed to produce message: {str(e)}'}), 500
        except Exception as e:
            return jsonify({'error': f'An unexpected error occurred: {str(e)}'}), 500
        
        
        return jsonify({'status': 'Order received'}), 200
    
    @staticmethod
    def get_all_orders():
        """Get all orders from the database in the required frontend format."""
        try:
            orders = Order.query.order_by(Order.created_at.desc()).all()
            result = []
            for idx, order in enumerate(orders, start=1):
                order_number = f"#{idx:03d}"
                customer_name = f"Table {order.table.number}" if order.table else "Unknown"
                created_at = order.created_at.isoformat() if order.created_at else None
                total_amount = order.total_price if hasattr(order, 'total_price') else sum(item.unit_price * item.quantity for item in order.items)
                items = []
                for item in order.items:
                    drink = item.drink
                    items.append({
                        'id': str(item.id),
                        'name': drink.name if drink else 'Unknown',
                        'quantity': item.quantity,
                        'price': item.unit_price,
                        'status': item.status if item.status else 'pending',
                    })
                result.append({
                    'id': str(order.id),
                    'orderNumber': order_number,
                    'customerName': customer_name,
                    'status': order.status,
                    'createdAt': created_at,
                    'totalAmount': total_amount,
                    'items': items
                })
            return result
        except Exception as e:
            raise Exception(f"Error fetching orders: {str(e)}")