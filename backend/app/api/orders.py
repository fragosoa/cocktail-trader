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
#@validate_json({'drinks': [], 'table_number': int})
def create_order():
    data = request.get_json()
    if 'drinks' not in data or not isinstance(data['drinks'], list) or len(data['drinks']) == 0:
        return jsonify({'error': 'El campo "drinks" debe ser un array no vacío'}), 400
    for drink in data['drinks']:
        if not all(field in drink for field in ['drink_id', 'quantity', 'table_number']):
            return jsonify({'error': 'Cada elemento en "drinks" debe tener drink_id, quantity, table_number'}), 400

    order = OrderService.create_order(data)

    return order