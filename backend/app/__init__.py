from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from app.api import orders_bp, price_lock_bp, drinks_bp
from app.extensions import db

def create_app(config_name='Development'):
    app = Flask(__name__)
    
    # Load configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://myuser:mypassword@localhost:5432/mydatabase'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    # Initialize extensions
    db.init_app(app)

    # Register blueprints
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(price_lock_bp, url_prefix='/api')
    app.register_blueprint(drinks_bp, url_prefix='/api')

    return app