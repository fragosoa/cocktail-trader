from flask import Blueprint, jsonify
from app.models.drink import Drink
#from app.services.order_service import OrderService
#from app.utils.decorators import validate_json

drinks_bp = Blueprint('drinks', __name__)

@drinks_bp.route('/drinks', methods=['GET'])
def get_all_drinks():
    """Get all drinks from the database."""
    try:
        drinks = Drink.query.all()
        
        # Format the drinks data
        drinks_data = [{
            'id': str(drink.id),
            'name': drink.name,
            'price': drink.price
        } for drink in drinks]
        
        return jsonify({
            'status': 'success',
            'data': drinks_data,
            'count': len(drinks_data)
        }), 200
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500