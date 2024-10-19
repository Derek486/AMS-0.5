# Kafka Container

Este contenedor de **Kafka** se encarga de gestionar la comunicación de datos en tiempo real entre diferentes servicios, actuando como un broker de mensajería.

## Servicios

### 1. Zookeeper
- Zookeeper es un servicio de coordinación que gestiona la configuración y sincronización de los nodos de Kafka.
- **Puerto expuesto**: `2181`

### 2. Kafka Broker
- Kafka Broker es el componente principal que gestiona la publicación y suscripción de mensajes.
- **Puerto expuesto**: `9092`

## Configuración del Contenedor

> [!TIP]
> Puedes crear un archivo `.env` en el mismo nivel de donde está el `docker-compose.yml` y conglomerar allí todas las variables necesarias para personalizar la configuración de Kafka y Zookeeper.

Para iniciar este contenedor de Kafka, sigue estos pasos:

### Paso 1: Variables de entorno

Debes configurar las siguientes variables de entorno:

- **`LISTENER_IP`**: Esta variable debe contener la dirección IP de la máquina que actuará como el broker de Kafka, a la que se conectarán los clientes para enviar y recibir mensajes.

> [!NOTE]
> En caso de ejecutar el broker de manera independiente, asegúrate de configurar esta variable con la dirección IP pública o el nombre de dominio de la máquina anfitriona. Por ejemplo, si estás utilizando un EC2, establece esta variable con la IP pública del servidor o su dominio correspondiente, además de habilitar el puerto 9092 con el protocolo TCP.