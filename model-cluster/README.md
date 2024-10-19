# Model Cluster

Este **Model Cluster** contiene la aplicación que ejecuta el modelo de predicción de fallas en los motores y gestiona el manejo de alertas con base en los datos de sensores (aceleración, velocidad y temperatura) enviados desde el front end de flask. Esta aplicación se comunica con otros servicios, como el broker de Kafka, para procesar los datos en tiempo real y generar alertas automáticas. Además, expone una conexión WebSocket para transmitir las alertas de manera instantánea.

## Aplicación Principal

### 1. **Aplicación de Predicción (FastAPI)**
- Esta aplicación utiliza **FastAPI** para gestionar las solicitudes y procesar los datos enviados supuestamente desde los sensores instalados en los motores.
- Los datos son procesados por el modelo de predicción para detectar posibles fallas en los motores.
- Una vez que se detecta una anomalía, se genera una alerta que es enviada a otros sistemas para ser gestionada.
- **Interacción con Kafka**: 
  - Se consume el tópico de Kafka, donde se encuentran los datos de los sensores de los motores, para analizarlos y procesarlos.
  - El modelo predice si se requiere generar una alerta basándose en los datos recibidos.

## Configuración del Cluster

Para iniciar el **Model Cluster** de manera independiente, se requiere ejecutar el archivo `docker-compose.yml` y configurar las siguientes variables de entorno:

### Variables de Entorno

- **`KAFKA_HOST`**: El host junto con el puerto donde está ejecutándose el broker de Kafka. Es fundamental que esta variable esté correctamente configurada para que la aplicación pueda consumir los datos enviados por los sensores.

- **`KAFKA_TOPIC`**: El tópico de Kafka desde el cual la aplicación de predicción consumirá los datos de los sensores. Puedes ajustar esta variable según el tópico que se esté utilizando en tu entorno de desarrollo o producción.
