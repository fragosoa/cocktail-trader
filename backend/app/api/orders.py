from flask import Blueprint, jsonify, request
from app.services.order_service import OrderService
#from app.utils.decorators import validate_json

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
#@validate_json({'drink_id': str, 'quantity': int})
def get_all_orders():
    """Get all orders from the database."""
    try:
        orders = OrderService.get_all_orders()  # Assuming this method exists in OrderService
        orders_data = [{
            'id': str(order.id),
            'status': order.status,
            'locked_price_used': order.locked_price_used
        } for order in orders]
        
        return jsonify({
            'status': 'success',
            'data': orders_data,
            'count': len(orders_data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@orders_bp.route('/orders', methods=['POST'])
#@validate_json({'drink_id': str, 'quantity': int})
def create_order():
    data = request.get_json()

    order = OrderService.create_order(
        locked_price_used=data.get('locked_price_used', False)
    )
    return jsonify({
        'response': 'called get_orders service',
        'order': str(order.id)
    }), 200