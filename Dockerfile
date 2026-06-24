FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY package.json ./
RUN npm install
COPY src/ ./src/
COPY public/ ./public/
COPY tailwind.config.js postcss.config.js ./
RUN npm run build

FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/ ./backend/
COPY --from=frontend-build /app/frontend/build ./static
ENV JWT_SECRET=change-me-in-production
EXPOSE 8001
CMD ["python", "backend/server.py"]
