from flask_sqlalchemy import SQLAlchemy
import redis
from confluent_kafka import Producer
from flask_socketio import SocketIO


db = SQLAlchemy()
kafka_producer = None
redis_client = None
socketio = SocketIO(cors_allowed_origins="*")

def init_kafka_producer(app):
    global kafka_producer
    kafka_config = {
        'bootstrap.servers': app.config.get('KAFKA_BOOTSTRAP_SERVERS', 'localhost:9092')
    }
    kafka_producer = Producer(kafka_config)

def init_redis(app):
    global redis_client
    redis_url = app.config.get('REDIS_URL', 'redis://localhost:6379/0')
    redis_client = redis.StrictRedis.from_url(redis_url)

def init_socketio(app):
    global socketio
    socketio.init_app(app)