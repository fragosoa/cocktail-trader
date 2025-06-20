from flask import Blueprint, jsonify, request
from app.services.price_lock_service import PriceLockService


price_lock_bp = Blueprint('price_lock', __name__)

@price_lock_bp.route('/price_lock', methods=['POST'])
def price_lock():
    data = request.get_json()
    required_fields = ['drink_id','current_price']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Required fileds'}), 400
    

    response = PriceLockService.lock_price(data)
    return response