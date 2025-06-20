from confluent_kafka import Consumer

KAFKA_BOOTSTRAP_SERVERS = 'localhost:9092'
KAFKA_TOPIC = 'create_order'
KAFKA_GROUP_ID = 'order_consumer_group'

def main():
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
            print(f"Mensaje recibido: {msg.value().decode('utf-8')}")
    except KeyboardInterrupt:
        print("Cerrando consumidor...")
    finally:
        consumer.close()

if __name__ == "__main__":
    main()
