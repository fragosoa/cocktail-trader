import app.extensions
from flask import jsonify, current_app
import redis

class PriceLockService:
    @staticmethod
    def lock_price(data):
        drink_id = data['drink_id']
        current_price = data['current_price']
        
        redis_key = f"price_lock:{drink_id}"
        redis_client = app.extensions.redis_client
        
        if redis_client is None:
            return jsonify({'error': 'Redis client not initialized'}), 500
        expiration = current_app.config.get('PRICE_LOCK_EXPIRATION_SECONDS', 60)
        try:
            if redis_client.get(redis_key) is None:
                redis_client.set(redis_key, current_price, ex=expiration)
                locked = True
            else:
                locked = False
        except redis.exceptions.RedisError as e:
            return jsonify({'error': 'Redis connection error', 'details': str(e)}), 500
        
        return jsonify({'locked': locked, 'drink_id': drink_id, 'current_price': current_price, 'expires_in': expiration}), 200
