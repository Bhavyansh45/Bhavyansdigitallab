# Bhavyansh Digital Lab – Developer Business OS

Monorepo containing:
- `backend/` Node + Express + MySQL REST API
- `frontend/` React + Vite + Tailwind admin + portfolio UI
- `database/schema.sql` MySQL schema

## Quick start

### 1) Database
```bash
mysql -u root -p < database/schema.sql
```

### 2) Backend
```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 3) Frontend
```bash
cd frontend
npm install
npm run dev
```

## Architecture
- Public pages: home/about/services/products/download/contact
- Admin panel: dashboard + estimate/invoice/finance/docs/apps/licenses/projects/time/settings
- JWT single-admin auth
- Puppeteer based estimate/invoice PDF

## Deployment
- Frontend: Vercel
- Backend: Render/VPS
- DB: Hostinger/PlanetScale/VPS MySQL
