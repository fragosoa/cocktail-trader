from flask import Blueprint, jsonify, request
#from app.services.order_service import OrderService
#from app.utils.decorators import validate_json

price_lock_bp = Blueprint('price_lock', __name__)

@price_lock_bp.route('/price_lock', methods=['GET'])
def price_lock():
    return jsonify({'response': 'called price_lock service' }), 200