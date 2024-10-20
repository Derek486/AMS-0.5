# Motor Manager AMS 0.5

Motor Manager AMS es un sistema diseñado para gestionar y monitorear motores de rotación constante. Utiliza tecnologías modernas como Docker, Kafka y Flask para proporcionar una solución robusta y escalable.

## Clonación del Repositorio

Para clonar este repositorio, asegúrate de tener Git instalado en tu máquina. Luego, ejecuta el siguiente comando:

```bash
git clone --recurse-submodules https://github.com/JuanJoseTCP/AMS-0.5.git
```

## Tabla de Contenidos

1. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
2. [Servicios](#servicios)
    - [1. Kafka Container](#1-kafka-container)
    - [2. Front Cluster](#2-front-cluster)
    - [3. Backend Container](#3-backend-container)
3. [Configuración del Proyecto](#configuración-del-proyecto)
4. [Iniciar el Proyecto](#iniciar-el-proyecto)

## Arquitectura del Proyecto

La arquitectura de Motor Manager AMS está compuesta por varios contenedores que trabajan en conjunto para ofrecer funcionalidades de administración y monitoreo de motores. Se organiza en tres principales secciones: Kafka Container, Front Cluster y Backend Container.

## Servicios

### 1. Kafka Container

Este contenedor de **Kafka** gestiona la comunicación de datos en tiempo real entre diferentes servicios, actuando como un broker de mensajería.

#### Servicios

- **Zookeeper**
  - Descripción: Servicio de coordinación que gestiona la configuración y sincronización de los nodos de Kafka.
  - **Puerto expuesto**: `2181`

- **Kafka Broker**
  - Descripción: Componente principal que gestiona la publicación y suscripción de mensajes.
  - **Puerto expuesto**: `9092`

### 2. Front Cluster

Este **Front Cluster** contiene dos aplicaciones que trabajan en conjunto para la gestión y el monitoreo de motores industriales:

#### Aplicaciones

- **Aplicación de Administración (React)**
  - Funciones: Autenticación, registro de usuarios, operaciones CRUD sobre la tabla de motores.
  - **Rutas principales**:
    - `/auth`: Para autenticación y registro.
    - `/`: Para las operaciones generales de la aplicación (CRUD, visualización de datos, etc.).

- **Aplicación de Envío de Datos (Flask)**
  - Funciones: Simula el control de flujo de datos enviados desde un sensor de vibración de los motores.
  - **Ruta principal**:
    - `/testing`: Para simular el envío de datos desde los motores.

### 3. Backend Container

Este contenedor es responsable de gestionar el procesamiento de datos de los motores y realizar operaciones CRUD sobre ellos. Incluye servicios de bases de datos y herramientas de monitoreo.

#### Servicios

- **worker.db**
  - Descripción: Base de datos interna utilizando PostgreSQL. Almacena datos relevantes sobre los motores.
  - **Puertos**: Expone el puerto `5432` para conexiones a la base de datos.

- **worker.dotnet**
  - Descripción: Lógica del backend que gestiona el procesamiento de datos y las interacciones con Kafka y PostgreSQL.
  - **Puertos**: Expone el puerto `8081` para interacciones con el backend.

- **cAdvisor, Prometheus y Grafana**
  - Descripción: Herramientas de monitoreo que proporcionan métricas sobre el rendimiento del sistema y visualización de datos, para la versión de desarrollo y muestra no serán consideradas.

## Configuración del Proyecto

Para una configuración adecuada de Motor Manager AMS, se recomienda crear un archivo `.env` en el mismo directorio donde se encuentra el `docker-compose.yml`. Este archivo debe contener todas las variables necesarias para personalizar la configuración de Kafka y Zookeeper, así como otras configuraciones del proyecto.

### Variables de Entorno Recomendadas

#### Para la Aplicación de Administración (React):

- **`MOTORES_API_URL`**: Indica la URL donde estará alojado el worker de C# encargado de las operaciones CRUD sobre los motores. No debe incluir una ruta específica, solo el host.

#### Para la Aplicación de Envío de Datos (Flask):

- **`KAFKA_BROKER`**: Indica el host donde estará alojado el broker de Kafka, para enviar los datos de prueba que serán analizados por el modelo.
  
> [!IMPORTANT]  
> Para garantizar una comunicación adecuada, asegúrate de que el valor de esta variable coincida con el que se utilizó para configurar el clúster de Kafka, específicamente en la variable `KAFKA_ADVERTISED_LISTENERS` (el host y el puerto).

- **`KAFKA_TOPIC`**: Define el tópico en el que se enviarán los datos. Este puede variar según la conveniencia del equipo de desarrollo.
- **`MOTORES_API_URL`**: Al igual que en la primera aplicación, esta variable indica la URL donde estará alojado el worker de C# para ejecutar las operaciones de lectura. No debe incluir una ruta específica, solo el host (puede compartirse con la variable de la primera aplicación).

### Variables de Entorno para Kafka y el Backend

#### Para Kafka:

- **`LISTENER_IP`**: Esta variable debe contener la dirección IP de la máquina que actuará como el broker de Kafka, a la que se conectarán los clientes para enviar y recibir mensajes.

#### Para el Backend (Worker de C#):

- **`PG_HOST`**: Host donde se ejecuta el contenedor de la base de datos PostgreSQL. Valor por defecto: `worker.db`.
- **`PG_PORT`**: Puerto de conexión a PostgreSQL. Valor por defecto: `5432`.
- **`PG_DB`**: Nombre de la base de datos PostgreSQL. Valor por defecto: `ams`.
- **`PG_USER`**: Nombre de usuario para acceder a PostgreSQL. Valor por defecto: `worker`.
- **`PG_PASSWORD`**: Contraseña para el usuario de PostgreSQL. Valor por defecto: `pass123456`.
- **`KAFKA_HOST`**: Host del broker de Kafka. Debe coincidir con el valor de `KAFKA_BROKER`.
- **`KAFKA_TOPIC`**: Tópico para el envío de datos desde el backend. Valor por defecto: `vibration-topic`.

### Variables de Entorno para el `docker-compose.yml`

#### Variables Comunes

- **`PG_DB`**: Nombre de la base de datos PostgreSQL. Valor por defecto: `ams`.
- **`PG_USER`**: Nombre de usuario para acceder a PostgreSQL. Valor por defecto: `worker`.
- **`PG_PASSWORD`**: Contraseña para el usuario de PostgreSQL. Valor por defecto: `pass123456`.
- **`PG_HOST`**: Host donde se ejecuta el contenedor de la base de datos. Valor por defecto: `worker.db`.
- **`PG_PORT`**: Puerto de conexión a PostgreSQL. Valor por defecto: `5432`.

#### Variables Específicas

- **`KAFKA_TOPIC`**: Tópico para el envío de datos, que puede definirse o sobreescribirse al iniciar el contenedor. Valor por defecto: `vibration-topic`.

## Iniciar el Proyecto

Para iniciar el proyecto, sigue estos pasos:

1. Asegúrate de que Docker y Docker Compose estén instalados en tu máquina.
3. Ejecuta el siguiente comando para iniciar todos los servicios:

   ```bash
   docker-compose up -d
