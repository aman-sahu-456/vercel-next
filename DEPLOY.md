# Deployment: Frontend → Vercel, Backend → Fly.io

Two separate apps that talk over HTTPS. The connection has two halves:

1. Frontend env `NEXT_PUBLIC_BACKEND_URL` → the Fly.io backend URL.
2. Backend env `ALLOWED_ORIGIN` (CORS) → the Vercel frontend URL.

Deploy the **backend first** (you need its URL for the frontend), then the frontend,
then lock down the backend's CORS to the frontend's URL.

---

## 1. Backend → Fly.io

Prereqs: a [Fly.io](https://fly.io) account, `flyctl` installed (`curl -L https://fly.io/install.sh | sh`), then `fly auth login`.

```bash
cd backend

# Create the app. Pick a unique name; this becomes https://<app>.fly.dev
# Use --no-deploy so we can deploy explicitly after reviewing config.
fly launch --no-deploy --copy-config --name my-next-backend

# Deploy (builds the Dockerfile, pushes, runs it)
fly deploy
```

Notes:
- `fly.toml` is already set up (Dockerfile build, internal port 8080, auto start/stop).
- If `fly launch` asks to overwrite `fly.toml`, keep the existing one (`--copy-config`).
- After deploy, your backend is at **https://my-next-backend.fly.dev**.

Verify:
```bash
curl https://my-next-backend.fly.dev/api/hello
curl "https://my-next-backend.fly.dev/api/weather?city=London"
```

---

## 2. Frontend → Vercel

Prereqs: a [Vercel](https://vercel.com) account. Use the dashboard or the CLI.

### Option A — Vercel dashboard (recommended)
1. Push this repo to GitHub.
2. Vercel → **Add New… → Project** → import the repo.
3. **Important:** set **Root Directory** to `frontend` (this is a monorepo).
4. Add an Environment Variable:
   - `NEXT_PUBLIC_BACKEND_URL` = `https://my-next-backend.fly.dev`
5. **Deploy.** You get a URL like `https://my-next-frontend.vercel.app`.

### Option B — Vercel CLI
```bash
cd frontend
npm i -g vercel
vercel                       # link/create project; set root to current dir
vercel env add NEXT_PUBLIC_BACKEND_URL production
# paste: https://my-next-backend.fly.dev
vercel --prod
```

> `NEXT_PUBLIC_*` vars are baked in at build time — after changing it, redeploy.

---

## 3. Connect them (lock down CORS)

Now point the backend's CORS at your real Vercel URL so only it can call the API:

```bash
cd backend
fly secrets set ALLOWED_ORIGIN=https://my-next-frontend.vercel.app
# (fly redeploys automatically when secrets change)
```

Leaving `ALLOWED_ORIGIN` unset keeps CORS open to `*` (fine for testing).

---

## 4. Verify end-to-end

Open your Vercel URL. The page should show **"Backend online"** and return weather
for a searched city. If weather fails but `curl` to the Fly URL works, it's almost
always CORS — confirm `ALLOWED_ORIGIN` exactly matches the Vercel origin
(scheme + host, no trailing slash).

---

## Summary of the two links

| Where | Variable | Value |
|-------|----------|-------|
| Vercel (frontend) | `NEXT_PUBLIC_BACKEND_URL` | `https://<app>.fly.dev` |
| Fly.io (backend)  | `ALLOWED_ORIGIN`         | `https://<project>.vercel.app` |
