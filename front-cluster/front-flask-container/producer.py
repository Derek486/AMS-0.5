from kafka import KafkaProducer
import json

def send_to_kafka(broker, topic, message):
  producer = KafkaProducer(bootstrap_servers=broker)
  producer.send(topic, json.dumps(message).encode('utf-8'))
  producer.flush()