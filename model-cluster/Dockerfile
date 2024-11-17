FROM python:3.10-slim

# Si usas "curl" en algún paso (opcional)
RUN apt-get update && \
  apt-get install -y --no-install-recommends curl && \
  apt-get clean && \
  rm -rf /var/lib/apt/lists/*

# Crear directorio de trabajo
WORKDIR /app

# Copiar las dependencias de Python
COPY requirements.txt requirements.txt

# Instalar las dependencias de Python sin usar caché
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código del proyecto
COPY . .

# Comando por defecto para ejecutar FastAPI
CMD ["python", "server.py"]
