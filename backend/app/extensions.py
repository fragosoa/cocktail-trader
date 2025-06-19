from flask_sqlalchemy import SQLAlchemy
#from confluent_kafka import Producer

db = SQLAlchemy()
kafka_producer = None

def init_kafka_producer(app):
    # TODO: Initialize the Kafka producer with the app's configuration
    pass