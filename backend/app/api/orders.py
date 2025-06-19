from flask import Blueprint, jsonify, request
#from app.services.order_service import OrderService
#from app.utils.decorators import validate_json

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
#@validate_json({'drink_id': str, 'quantity': int})
def get_orders():
    return jsonify({'response': 'called get_orders service' }), 200