# Deployment: Frontend → Vercel, Backend → Railway

Two separate apps that talk over HTTPS. The connection has two halves:

1. Frontend env `NEXT_PUBLIC_BACKEND_URL` → the Railway backend URL.
2. Backend env `ALLOWED_ORIGIN` (CORS) → the Vercel frontend URL.

Deploy the **backend first** (you need its URL for the frontend), then the frontend,
then lock down the backend's CORS to the frontend's URL.

---

## 1. Backend → Railway

Prereqs: a [Railway](https://railway.app) account and your repo pushed to GitHub.
Railway builds the `backend/Dockerfile` automatically.

### Dashboard (recommended)
1. Railway → **New Project → Deploy from GitHub repo** → pick this repo.
2. Open the service → **Settings**:
   - **Root Directory** = `backend`  ⚠️ (the backend lives in a subfolder)
   - Railway auto-detects `backend/Dockerfile` as the builder.
3. **Settings → Networking → Generate Domain** → gives a public URL like
   `https://my-next-backend.up.railway.app`.
   - Railway injects `PORT` automatically; the Dockerfile already binds to it
     (`HOSTNAME=0.0.0.0`), so no port config is needed.
4. (Optional, do later) **Variables** → add `ALLOWED_ORIGIN` = your Vercel URL.
5. Railway deploys on every push to the repo.

### CLI (alternative)
```bash
npm i -g @railway/cli
railway login
cd backend
railway init          # create/link a project
railway up            # build & deploy from this directory
railway domain        # generate a public URL
```

Verify:
```bash
curl https://my-next-backend.up.railway.app/api/hello
curl "https://my-next-backend.up.railway.app/api/weather?city=London"
```

---

## 2. Frontend → Vercel

Prereqs: a [Vercel](https://vercel.com) account. Use the dashboard or the CLI.

### Option A — Vercel dashboard (recommended)
1. Push this repo to GitHub.
2. Vercel → **Add New… → Project** → import the repo.
3. **Important:** set **Root Directory** to `frontend` (this is a monorepo).
4. Add an Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://my-next-backend.up.railway.app`
5. **Deploy.** You get a URL like `https://my-next-frontend.vercel.app`.

### Option B — Vercel CLI
```bash
cd frontend
npm i -g vercel
vercel                       # link/create project; set root to current dir
vercel env add NEXT_PUBLIC_BACKEND_URL production
# paste: https://my-next-backend.up.railway.app
vercel --prod
```

> `NEXT_PUBLIC_*` vars are baked in at build time — after changing it, redeploy.

---

## 3. Connect them (lock down CORS)

Now point the backend's CORS at your real Vercel URL so only it can call the API.
In the **Railway** dashboard → your service → **Variables**, add:

```
ALLOWED_ORIGIN = https://my-next-frontend.vercel.app
```

Railway redeploys automatically when variables change. Leaving `ALLOWED_ORIGIN`
unset keeps CORS open to `*` (fine for testing).

---

## 4. Verify end-to-end

Open your Vercel URL. The page should show **"Backend online"** and return weather
for a searched city. If weather fails but `curl` to the Railway URL works, it's almost
always CORS — confirm `ALLOWED_ORIGIN` exactly matches the Vercel origin
(scheme + host, no trailing slash).

---

## Summary of the two links

| Where | Variable | Value |
|-------|----------|-------|
| Vercel (frontend)  | `NEXT_PUBLIC_BACKEND_URL` | `https://<app>.up.railway.app` |
| Railway (backend)  | `ALLOWED_ORIGIN`          | `https://<project>.vercel.app` |
