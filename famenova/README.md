# REX Agency

Full-stack SMMA platform with lead capture, admin dashboard, and analytics.

## Architecture

```
rex-agency/
├── frontend/           # React + Vite public website
├── backend/            # Node.js + Express API server
├── admin-dashboard/    # React + Vite admin panel
├── docs/               # Documentation
├── docker-compose.yml  # Full stack orchestration
└── .env                # Environment configuration
```

## Tech Stack

| Layer           | Tech                                      |
| --------------- | ----------------------------------------- |
| Frontend        | React 18, Vite, React Router, Axios       |
| Backend         | Node.js, Express, JWT, bcrypt             |
| Admin Dashboard | React 18, Vite, Recharts, React Hot Toast |
| Database        | Excel + JSON file storage                 |
| Email           | Nodemailer (Gmail SMTP)                   |
| Deployment      | Docker Compose                            |

## Quick Start

```bash
# 1. Install root dependencies
npm install

# 2. Install all sub-project dependencies
npm run install:all

# 3. Configure environment
cp .env .env.local
# Edit .env with your SMTP credentials and JWT secret

# 4. Start development (all services)
npm run dev
```

Or run individually:

```bash
npm run dev:backend    # API on http://localhost:5000
npm run dev:frontend   # Website on http://localhost:5173
npm run dev:admin      # Dashboard on http://localhost:5174
```

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

Services:
- **Frontend**: http://localhost:3001
- **Admin Dashboard**: http://localhost:3002
- **Backend API**: http://localhost:5000

## Environment Variables

| Variable         | Description                    | Default                              |
| ---------------- | ------------------------------ | ------------------------------------ |
| `PORT`           | Backend server port            | `5000`                               |
| `NODE_ENV`       | Environment mode               | `development`                        |
| `JWT_SECRET`     | JWT signing secret             | — (required)                         |
| `JWT_EXPIRES_IN` | JWT token expiry               | `7d`                                 |
| `SMTP_HOST`      | Gmail SMTP host                | `smtp.gmail.com`                     |
| `SMTP_PORT`      | SMTP port                      | `587`                                |
| `SMTP_USER`      | Gmail address                  | `rexagency0@gmail.com`               |
| `SMTP_PASS`      | Gmail App Password             | —                                    |
| `NOTIFY_EMAIL`   | Lead notification recipient    | `rexagency0@gmail.com`               |
| `EXCEL_PATH`     | Excel file fallback path       | `./dataset/leads.xlsx`               |

## API Endpoints

### Public
| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/api/submit`    | Submit inquiry form   |
| GET    | `/api/leads/count` | Get total lead count |
| GET    | `/api/health`    | Health check          |

### Auth
| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/auth/login`     | Admin login         |
| POST   | `/api/auth/register`  | Create admin user   |
| GET    | `/api/auth/profile`   | Get current user    |
| PUT    | `/api/auth/password`  | Update password     |

### Leads (Protected)
| Method | Endpoint           | Description                    |
| ------ | ------------------ | ------------------------------ |
| GET    | `/api/leads`       | Get all leads (pagination)     |
| GET    | `/api/leads/:id`   | Get lead by ID                 |
| PUT    | `/api/leads/:id`   | Update lead                    |
| DELETE | `/api/leads/:id`   | Delete lead (admin only)       |
| GET    | `/api/leads/stats` | Get lead statistics            |

## Admin Dashboard

Access at `/admin` or `http://localhost:3002`

- **Overview**: Lead stats, charts, recent leads
- **Leads**: Full CRUD with search, filter, pagination
- **Analytics**: Niche breakdown, trends, conversion funnel
- **Settings**: Profile and password management

Default admin credentials:
- Email: `admin@rexagency.com`
- Password: `admin123`

## Features

### Public Website
- Hero with animated stats and floating badges
- Services showcase (Paid Ads, Short-Form Content, Lead Gen)
- Case studies with metrics
- 4-step process/methodology
- High-converting inquiry form with validation
- Modal popup form
- Scroll-reveal animations
- Fully responsive (mobile-first)

### Backend
- Excel + JSON file storage
- JWT authentication with role-based access
- Email notifications via Gmail SMTP
- Input validation and sanitization
- Rate limiting and security headers
- Paginated queries with search/filter

### Admin Dashboard
- Real-time lead statistics
- Interactive charts (Recharts)
- Lead management with status tracking
- Analytics and reporting
- Dark theme matching main site

## Default Admin Setup

Register via API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@rexagency.com","password":"admin123","role":"admin"}'
```

## License

MIT
