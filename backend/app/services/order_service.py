from app.extensions import db
from app.models.order import Order
from app.models.drink import Drink
from app.models.table import Table
from app.models.order_item import OrderItem
import app.extensions
import uuid
from flask import jsonify

class OrderService:
    @staticmethod
    def create_order(data):
        drinks = data.get('drinks')
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
        
        #order = OrderService._create_transaction(drinks_to_process)
        order = OrderService._create_transaction_async(drinks_to_process)
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
    def _create_transaction(drinks):
        # TODO: publish to a kafka topic. We should push to process_order topic
        
        table = Table.query.filter_by(number=5).first()
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
        new_order.calculate_total()
        db.session.add(new_order)
        db.session.commit()
        return jsonify({'drinks_list': drinks}), 200
    
    @staticmethod
    def _create_transaction_async(drinks):
        # Publicar mensaje de prueba en Kafka
        kafka_producer = app.extensions.kafka_producer
        
        if kafka_producer is None:
            return {'error': 'Kafka producer not initialized'}
        topic = 'create_order'
        message = 'hola mundo'
        kafka_producer.produce(topic, value=message.encode('utf-8'))
        kafka_producer.flush()
        return jsonify({'status': 'Mensaje publicado en Kafka'}), 200