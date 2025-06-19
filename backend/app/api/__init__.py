# Importa y re-exporta los blueprints
from .orders import orders_bp
from .price_locks import price_lock_bp

# Opcional: lista explícita de lo que se exporta
__all__ = ['orders_bp', 'price_lock_bp']
