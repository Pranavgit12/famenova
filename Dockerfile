FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci
COPY frontend/ .
RUN npm run build


FROM node:20-alpine AS admin-build

WORKDIR /app/admin-dashboard
COPY admin-dashboard/package.json admin-dashboard/package-lock.json* ./
RUN npm ci
COPY admin-dashboard/ .
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY backend/package.json backend/package-lock.json* ./
RUN npm ci --omit=dev && npm cache clean --force

COPY backend/ .

RUN mkdir -p /app/dataset /app/uploads

COPY --from=frontend-build /app/frontend/dist /frontend/dist
COPY --from=admin-build /app/admin-dashboard/dist /admin-dashboard/dist

RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup && \
    chown -R appuser:appgroup /app /frontend /admin-dashboard

USER appuser

EXPOSE 5000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/health || exit 1

CMD ["node", "server.js"]
