# REX Agency Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB 7+ (local or Atlas)
- Docker & Docker Compose (for containerized deployment)
- Gmail App Password for email notifications

## Option 1: Docker Deployment (Recommended)

### 1. Configure Environment

```bash
cp .env .env.local
# Edit .env.local with your credentials
```

### 2. Build and Start

```bash
docker-compose up -d --build
```

### 3. Access Services

- Website: http://localhost:3001
- Admin Dashboard: http://localhost:3002
- API: http://localhost:5000
- MongoDB: localhost:27017

### 4. Create Admin User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@rexagency.com","password":"admin123","role":"admin"}'
```

## Option 2: Manual Deployment

### 1. Install Dependencies

```bash
npm install
npm run install:all
```

### 2. Start MongoDB

```bash
# Local
mongod --dbpath /data/db

# Or use MongoDB Atlas connection string in .env
```

### 3. Configure Environment

Edit `.env` with your settings.

### 4. Build Frontend Apps

```bash
npm run build
```

### 5. Start Backend

```bash
npm start
```

The backend serves the built frontend from `frontend/dist` and admin from `admin-dashboard/dist`.

## Option 3: Separate Services

Run each service independently for development:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend (Vite dev server)
npm run dev:frontend

# Terminal 3 - Admin Dashboard (Vite dev server)
npm run dev:admin
```

## Production Checklist

- [ ] Set strong JWT_SECRET in .env
- [ ] Change default admin password
- [ ] Configure SMTP credentials
- [ ] Set NODE_ENV=production
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS (nginx reverse proxy)
- [ ] Configure CORS origins
- [ ] Set up log rotation
- [ ] Configure backup for MongoDB
- [ ] Set up monitoring (health endpoint)

## Nginx Reverse Proxy Example

```nginx
server {
    listen 80;
    server_name rexagency.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Environment Variables Reference

See [Environment Variables](../README.md#environment-variables) in the main README.

## Troubleshooting

### MongoDB Connection Failed

The backend falls back to Excel storage automatically. Check:
1. MongoDB is running
2. Connection string is correct
3. Database user has proper permissions

### Email Not Sending

1. Verify Gmail App Password is generated
2. Check SMTP_USER and SMTP_PASS in .env
3. Ensure 2FA is enabled on the Gmail account

### Frontend Not Loading

1. Run `npm run build` in frontend/
2. Check that backend serves static files correctly
3. Verify VITE_API_URL environment variable
