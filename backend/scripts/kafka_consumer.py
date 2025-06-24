from confluent_kafka import Consumer
import json
from app.services.order_service import OrderService
from app import create_app

KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC = 'create_order'
KAFKA_GROUP_ID = 'order_consumer_group'

def main():
    app = create_app()
    with app.app_context():
        consumer = Consumer({
            'bootstrap.servers': KAFKA_BOOTSTRAP_SERVERS,
            'group.id': KAFKA_GROUP_ID,
            'auto.offset.reset': 'earliest',
        })
        consumer.subscribe([KAFKA_TOPIC])
        print(f"Escuchando mensajes en el topic '{KAFKA_TOPIC}'...")
        try:
            while True:
                msg = consumer.poll(1.0)
                if msg is None:
                    continue
                if msg.error():
                    print(f"Error: {msg.error()}")
                    continue
                try:
                    data = json.loads(msg.value().decode('utf-8'))
                    print("Mensaje recibido (decodificado):", data)
                    OrderService.submit_transaction(data)
                    print("Orden procesada y guardada en la base de datos.")
                except Exception as e:
                    print("Error al procesar el mensaje:", e)
        except KeyboardInterrupt:
            print("Cerrando consumidor...")
        finally:
            consumer.close()

if __name__ == "__main__":
    main()
