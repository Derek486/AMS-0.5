FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
ARG VITE_MODEL_HOST
ENV VITE_MODEL_HOST=${VITE_MODEL_HOST}

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
