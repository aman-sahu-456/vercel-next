# vercelNext — two separate Next.js projects

- `frontend/` — Next.js app with a Hello World page (runs on port **3000**). It fetches a message from the backend.
- `backend/`  — API-only Next.js app (runs on port **4000**) with CORS:
  - `GET /api/hello`
  - `GET /api/weather?city=London` — current weather via [Open-Meteo](https://open-meteo.com) (free, no API key needed).

## Run

Open two terminals.

**Backend** (start this first):
```bash
cd backend
npm install
npm run dev        # http://localhost:4000  (API at /api/hello)
```

**Frontend**:
```bash
cd frontend
npm install
npm run dev        # http://localhost:3000
```

Then open http://localhost:3000 — the page loads "Hello World" and shows the message fetched from the backend.

To point the frontend at a different backend URL, set `NEXT_PUBLIC_BACKEND_URL` (e.g. in `frontend/.env.local`).
