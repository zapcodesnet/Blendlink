# BlendLink

The All-in-One Super App for Social, Commerce, and Play.

## Architecture

| Component | Platform | URL |
|-----------|----------|-----|
| Backend API | Render | `https://blendlink-api.onrender.com` |
| Frontend | Cloudflare Pages | `https://blendlink.pages.dev` |
| Database | MongoDB Atlas | Dedicated BlendLink cluster |

> **BlendLink and Zapcodes use SEPARATE MongoDB clusters** under the same Atlas account.
> They share nothing — separate data, separate performance, separate backups.

## MongoDB Setup (Do This First)

1. Log into [cloud.mongodb.com](https://cloud.mongodb.com) (your existing Zapcodes account)
2. Click **"Create"** → Choose M2 ($9/mo) or M10 ($57/mo)
3. Name it **"BlendLink-Production"**
4. Region: **Oregon** (same as Render)
5. Go to **Database Access** → Add user: `blendlink_admin` with a strong password
6. Go to **Network Access** → Add `0.0.0.0/0` (allow all, needed for Render)
7. Click **Connect** → **Drivers** → Copy the connection string
8. Replace `<password>` and add database name at the end:

```
mongodb+srv://blendlink_admin:YOUR_PASSWORD@blendlink-production.XXXXX.mongodb.net/blendlink_db
```

Your Atlas account will look like:
```
MongoDB Atlas Account
├── Zapcodes-Cluster      ← existing, untouched
│   └── zapcodes_db
└── BlendLink-Production  ← new dedicated cluster
    └── blendlink_db
```

## Deploy Backend → Render

1. Push this repo to GitHub
2. Go to [render.com](https://render.com) → New → Web Service → Connect GitHub repo
3. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server:app --host 0.0.0.0 --port $PORT`
4. Environment Variables (Settings tab):

| Variable | Value |
|----------|-------|
| `MONGODB_URI` | Your BlendLink cluster connection string from step 8 above |
| `JWT_SECRET` | Run `openssl rand -hex 32` and paste the result |
| `JWT_EXPIRY_HOURS` | `24` |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `CORS_ORIGINS` | `https://blendlink.pages.dev` (update after frontend deploy) |

5. Click Deploy

## Deploy Frontend → Cloudflare Pages

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Workers & Pages → Create
2. Connect your GitHub repo
3. Build settings:
   - **Framework preset:** Create React App
   - **Root directory:** `frontend`
   - **Build command:** `npm run build`
   - **Build output directory:** `build`
4. Environment Variables:

| Variable | Value |
|----------|-------|
| `REACT_APP_API_URL` | Your Render URL (e.g. `https://blendlink-api.onrender.com`) |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |

5. Deploy

## After Both Are Live

Update `CORS_ORIGINS` on Render to match your Cloudflare URL:
```
CORS_ORIGINS=https://blendlink.pages.dev,https://blendlink.net
```

## Local Development

```bash
# Backend
cd backend
pip install -r requirements.txt
cp .env.example .env  # Fill in your values
uvicorn server:app --reload --port 8000

# Frontend (separate terminal)
cd frontend
npm install
cp .env.example .env
npm start
```

## Environment Variables Reference

See `backend/.env.example` and `frontend/.env.example` for all variables.
 
