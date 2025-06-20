from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.api import orders_bp, price_lock_bp, drinks_bp
from app.extensions import db, init_redis, init_kafka_producer
from app.config import config

def create_app(config_name='development'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config.get(config_name.lower(), config['default']))

    # Initialize extensions
    db.init_app(app)
    init_redis(app)
    init_kafka_producer(app)

    # Register blueprints
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(price_lock_bp, url_prefix='/api')
    app.register_blueprint(drinks_bp, url_prefix='/api')

    return app