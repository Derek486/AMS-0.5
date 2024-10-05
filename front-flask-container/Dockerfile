FROM python:3.10-slim

RUN apt-get update && \
    apt-get install -y --no-install-recommends curl apt-transport-https gnupg2 && \
    curl https://packages.microsoft.com/keys/microsoft.asc | apt-key add - && \
    curl https://packages.microsoft.com/config/debian/10/prod.list > /etc/apt/sources.list.d/mssql-release.list && \
    apt-get update && \
    ACCEPT_EULA=Y apt-get install -y msodbcsql17 unixodbc-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/app

COPY . . 
RUN pip install -r requirements.txt

ENV FLASK_ENV=development
CMD ["python", "app.py"]