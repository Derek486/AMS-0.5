# Front Cluster

Este **Front Cluster** contiene dos aplicaciones que trabajan en conjunto para la gestión y el monitoreo de motores industriales:

## Aplicaciones

### 1. Aplicación de Administración (React)
- Permite la autenticación y registro de usuarios.
- Facilita operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre la tabla de motores.
- **Rutas principales**:
  - `/auth`: Para autenticación y registro.
  - `/`: Para las operaciones generales de la aplicación (CRUD, visualización de datos, etc.).

### 2. Aplicación de Envío de Datos (Flask)
- Simula el control de flujo de datos enviados desde un sensor de vibración de los motores.
- Permite seleccionar cualquier motor previamente creado y enviar diferentes tipos de datos:
  - **Aceleración**
  - **Velocidad**
  - **Temperatura**
- Los datos son enviados a un modelo de predicción, y las alertas resultantes son gestionadas por la **Aplicación de Administración**.
- **Ruta principal**:
  - `/testing`: Para simular el envío de datos desde los motores.

## Interacción entre las Aplicaciones
- La **Aplicación de Administración** se encarga de la gestión de motores y usuarios, además de la recepción de alertas generadas por el análisis de los datos.
- La **Aplicación de Envío de Datos** simula la transmisión de datos que se originan desde sensores instalados en los motores.

## Configuración del Cluster

Para iniciar este **Front Cluster**, es necesario ejecutar el archivo `docker-compose.yml` y configurar las siguientes variables de entorno:

### Para la Aplicación de Administración (React):
- **`MOTORES_API_URL`**: Indica la URL donde estará alojado el worker de C# encargado de las operaciones CRUD sobre los motores. No debe incluir una ruta específica, solo el host.

### Para la Aplicación de Envío de Datos (Flask):
- **`KAFKA_BROKER`**: Indica el host donde estará alojado el broker de Kafka, para enviar los datos de prueba que serán analizados por el modelo.

    --- 

    > [!IMPORTANT]  
    > Para garantizar una comunicación adecuada, asegúrate de que el valor de esta variable coincida con el que se utilizó para configurar el clúster de Kafka, específicamente en la variable `KAFKA_ADVERTISED_LISTENERS` (el host y el puerto).

    --- 

- **`KAFKA_TOPIC`**: Define el tópico en el que se enviarán los datos. Este puede variar según la conveniencia del equipo de desarrollo.
- **`MOTORES_API_URL`**: Al igual que en la primera aplicación, esta variable indica la URL donde estará alojado el worker de C# para ejecutar las operaciones de lectura. No debe incluir una ruta específica, solo el host (puede compartirse con la variable de la primera aplicación).

--- 

> [!IMPORTANT]  
> Verifica que los demás clusters (Kafka y backend) estén en funcionamiento y operando correctamente. Si alguno de ellos presenta problemas, podrías enfrentar dificultades al realizar operaciones o al acceder a la aplicación.

--- 