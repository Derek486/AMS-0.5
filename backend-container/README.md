# Backend Container

Este contenedor es responsable de gestionar el procesamiento de datos de los motores y realizar las operaciones CRUD sobre los mismos. Incluye servicios de bases de datos (un contenedor PostgreSQL interno), monitoreo y análisis, junto con herramientas como Prometheus, Grafana y cAdvisor para la observación del rendimiento del sistema.

## Servicios

### 1. **worker.database**
- **Descripción**: Este servicio utiliza la imagen oficial de PostgreSQL y actúa como la base de datos interna del sistema. Almacena todos los datos relevantes sobre los motores y permite realizar operaciones CRUD.
- **Variables de Entorno**:
  - `POSTGRES_DB`: Nombre de la base de datos a crear en PostgreSQL.
  - `POSTGRES_USER`: Usuario que se utilizará para conectarse a la base de datos.
  - `POSTGRES_PASSWORD`: Contraseña del usuario de PostgreSQL.
- **Puertos**: Expone el puerto `5432` para conexiones a la base de datos.
- **Healthcheck**: Realiza una verificación de salud cada 10 segundos para asegurar que la base de datos esté lista para aceptar conexiones.

### 2. **worker-ams**
- **Descripción**: Este servicio es responsable de la lógica del backend, gestionando el procesamiento de datos y las interacciones con Kafka y la base de datos PostgreSQL. Se asegura de que los datos se envíen al tópico de Kafka y se almacenen correctamente en la base de datos.
- **Variables de Entorno**:
  - `POSTGRES_HOST`: Dirección del contenedor de PostgreSQL.
  - `POSTGRES_PORT`: Puerto de conexión a PostgreSQL (por defecto, 5432).
  - `POSTGRES_DB`: Nombre de la base de datos en PostgreSQL.
  - `POSTGRES_USER`: Usuario de PostgreSQL.
  - `POSTGRES_PASSWORD`: Contraseña del usuario de PostgreSQL.
  - `KAFKA_HOST`: Dirección y puerto del broker de Kafka (ejemplo: `192.168.0.103:9092`).
  - `KAFKA_TOPIC`: Nombre del tópico de Kafka donde se enviarán los datos de vibración (ejemplo: `vibration-topic`).
- **Puertos**: Expone el puerto `8081` para interacciones con el backend.
- **Dependencias**: Depende del servicio `worker.database` y espera a que esté saludable antes de iniciar.

### 3. **cAdvisor**
- **Descripción**: cAdvisor proporciona métricas sobre el uso de recursos y el rendimiento de los contenedores de Docker. Monitorea el uso de CPU, memoria, disco y red.
- **Puertos**: Expone el puerto `8080` para acceder a la interfaz de cAdvisor.
- **Volúmenes**: Se monta en varios directorios del host para acceder a la información del sistema.

### 4. **Prometheus**
- **Descripción**: Prometheus es un sistema de monitoreo y almacenamiento de series temporales. Recolecta métricas de varios servicios y las almacena para su análisis.
- **Puertos**: Expone el puerto `9090` para acceder a la interfaz de Prometheus.
- **Dependencias**: Depende de `cAdvisor` para recopilar métricas.

### 5. **Grafana**
- **Descripción**: Grafana es una plataforma de análisis y monitoreo que permite visualizar las métricas recopiladas por Prometheus.
- **Puertos**: Expone el puerto `3000` para acceder a la interfaz de Grafana.
- **Dependencias**: Depende de `prometheus` para mostrar las métricas recopiladas.