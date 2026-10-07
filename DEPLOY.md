# Deploy: Render (Django) + Neon (Postgres) + Vercel (React)

## Order of work
1. **Rotate secrets first (repo is public).** Old `SECRET_KEY` is in git history; production uses a new one (Render generates it). If a real Razorpay key was ever committed, regenerate it in the Razorpay dashboard.
2. **Neon:** create a project, copy the connection string (`postgresql://...?sslmode=require`).
3. **Load data into Neon from your own computer** (Render free has no shell):
   ```bash
   cd backend
   export DATABASE_URL="<neon string>" RAZORPAY_KEY_ID=x RAZORPAY_KEY_SECRET=y
   pip install -r requirement.txt
   python manage.py migrate
   python manage.py import_locations
   python manage.py seed_data
   python manage.py createsuperuser
   ```
4. **Render:** New -> Blueprint -> pick this repo (reads `render.yaml`). Fill the env vars marked `sync: false`:
   - `DATABASE_URL`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
   - `ALLOWED_HOSTS` = `<service>.onrender.com`
   - `CORS_ALLOWED_ORIGINS` and `FRONTEND_URL` = your Vercel URL
   - `CSRF_TRUSTED_ORIGINS` = `https://<service>.onrender.com,https://<your-vercel-url>`
   - Email: `DEFAULT_FROM_EMAIL`, `MAILTRAP_HOST`, `MAILTRAP_PORT`, `MAILTRAP_USERNAME`, `MAILTRAP_PASSWORD` (the names say Mailtrap, but any SMTP provider works)
5. **Vercel:** import repo, Root Directory `frontend`, env var `VITE_API_URL=https://<service>.onrender.com/api/` (trailing `/api/` is required). `frontend/vercel.json` handles React Router refreshes.
6. **Razorpay dashboard:** webhook URL `https://<service>.onrender.com/api/payments/webhook/`, events `payment.captured` and `payment.failed`, secret = `RAZORPAY_WEBHOOK_SECRET`.
7. **GitHub:** Settings -> Branches -> protect `main`, require the `backend` and `frontend` checks. Render then deploys only when checks pass (`autoDeployTrigger: checksPass`); Vercel deploys every push to `main`.

## Things to know
- **Product images:** Render's free disk is wiped on every deploy, so images uploaded via admin disappear. Move `MEDIA` to Cloudinary (or similar) before real use.
- **Emails:** Mailtrap sandbox does not deliver to real inboxes. For real customers put a real SMTP provider's host/port/credentials in the `MAILTRAP_*` variables (Brevo, Gmail app password, etc.).
- **Sleeping:** Render free sleeps after 15 min idle (~1 min cold start); Razorpay webhooks are retried but may be late.
- **Tests:** every `tests.py` is an empty stub, so the CI test step passes without checking anything. Add tests for payments/orders next.
