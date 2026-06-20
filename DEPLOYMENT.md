# 🚀 UniGuj AI - Deployment Guide

## Deployment Options

### Option 1: Docker Compose (Local / VPS / Cloud VM)

**Best for:** Full control, local development, or any cloud VM (AWS, GCP, DigitalOcean, etc.)

```bash
# 1. Clone the repository
git clone <repo-url>
cd uniguj-ai

# 2. Set environment variables
cp backend/.env.example backend/.env
# Edit backend/.env with your values:
# - MONGODB_URI (use MongoDB Atlas or local MongoDB)
# - GEMINI_API_KEY (get from Google AI Studio)
# - JWT_SECRET (generate a secure random string)

# 3. Start all services
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
# MongoDB: localhost:27017
# Redis: localhost:6379
```

### Option 2: Render (Backend) + Vercel (Frontend)

**Best for:** Free tier hosting with auto-deployments

#### Backend on Render

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo>
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub
   - Create New Web Service
   - Connect your repository

3. **Configure Render Service**
   ```
   Language: Python 3
   Build Command: pip install -r requirements.txt
   Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

4. **Set Environment Variables in Render Dashboard**
   ```
   MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/unigujai
   GEMINI_API_KEY=your-gemini-api-key
   JWT_SECRET=your-super-secret-key
   ENVIRONMENT=production
   CORS_ORIGINS=https://your-frontend-url.vercel.app
   ```

5. **Add Health Check**
   - Health Check Path: `/health`
   - This ensures Render keeps your service alive

#### Frontend on Vercel

1. **Push Frontend to GitHub** (or same repo)

2. **Create Vercel Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Import Project

3. **Configure Vercel**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Set Environment Variables**
   ```
   VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1
   ```

5. **Deploy**
   - Vercel will auto-deploy on every push to main

### Option 3: MongoDB Atlas (Database) + Render (Backend) + Vercel (Frontend)

**Best for:** Production-ready, scalable, zero-maintenance

#### MongoDB Atlas Setup

1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster (M0 tier)
3. Create database user and whitelist IP (0.0.0.0/0 for all)
4. Get connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/unigujai?retryWrites=true&w=majority
   ```

#### Redis Setup (Optional - for caching)

1. Go to [redis.io/try-free](https://redis.io/try-free) or use [upstash.com](https://upstash.com)
2. Create free Redis instance
3. Get Redis URL:
   ```
   redis://default:password@host:port
   ```

#### Update Backend Environment

```bash
# backend/.env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/unigujai
REDIS_URL=redis://default:password@redis-host:6379
GEMINI_API_KEY=your-gemini-api-key
JWT_SECRET=your-super-secret-key
ENVIRONMENT=production
CORS_ORIGINS=https://uniguj-ai.vercel.app
```

### Option 4: Railway / Fly.io (Alternative Platforms)

#### Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
cd backend
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

#### Fly.io
```bash
# Install Fly CLI
curl -L https://fly.io/install.sh | sh

# Deploy backend
cd backend
fly launch
fly deploy

# Deploy frontend
cd frontend
fly launch
fly deploy
```

---

## 🔑 Getting API Keys

### Google Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API Key
3. Copy and add to backend `.env` as `GEMINI_API_KEY`

### MongoDB Atlas (if using cloud)
1. Sign up at [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create cluster → Database Access → Add user
3. Network Access → Add IP (0.0.0.0/0)
4. Clusters → Connect → Drivers → Python → Copy URI

---

## 📊 Monitoring & Health Checks

The backend exposes these endpoints:
- `GET /health` - Health check
- `GET /readiness` - Readiness probe
- `GET /docs` - Swagger UI (API documentation)
- `GET /openapi.json` - OpenAPI schema

---

## 🔄 CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Render
        run: |
          curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK_URL }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: cd frontend && npm ci && npm run build
      - name: Deploy to Vercel
        run: |
          cd frontend
          npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

---

## 🛠️ Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Verify all environment variables are set
- Check logs: `docker-compose logs backend`

### Frontend can't connect to backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend
- Ensure backend is running and accessible

### Database seeding issues
- MongoDB must be running before backend starts
- Check `docker-compose.yml` depends_on order
- Manually seed: `docker-compose exec backend python -m app.utils.data_seeder`

### Gemini API errors
- Verify API key is valid
- Check rate limits (60 requests/minute on free tier)
- Ensure billing is enabled if using paid tier

---

## 📈 Scaling

### Horizontal Scaling
- Use multiple Render instances with load balancer
- MongoDB Atlas auto-scales
- Redis caching reduces database load

### Performance Tips
- Enable Redis caching (5 min TTL for university data)
- Use CDN for static assets (Vercel handles this)
- Implement database indexing on frequently queried fields
- Use connection pooling for MongoDB

---

## 📝 Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend loads correctly
- [ ] API documentation accessible at `/docs`
- [ ] Database seeded with initial data
- [ ] Gemini API responding
- [ ] Authentication working (register/login)
- [ ] AI chat responding
- [ ] University search working
- [ ] Comparison feature working
- [ ] Scholarship finder working
- [ ] Placement data loading
- [ ] Mobile responsive design verified
- [ ] SSL/HTTPS enabled
- [ ] Environment variables secured
- [ ] Monitoring/alerting set up

---

**Need help?** Open an issue on GitHub or contact hello@unigujai.com
