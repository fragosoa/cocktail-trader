from flask import Blueprint, jsonify, request
#from app.services.order_service import OrderService
#from app.utils.decorators import validate_json

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/orders', methods=['GET'])
#@validate_json({'drink_id': str, 'quantity': int})
def create_order():
    return jsonify({'response': 'called create_order service' }), 200