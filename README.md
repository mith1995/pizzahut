# Pizza Hut Clone: Food Ordering Platform

A full-stack food ordering app built for learning. Users can browse the pizza menu, manage a cart, save delivery addresses, place orders, pay online with Razorpay, and review products.

> Learning project. Not affiliated with or endorsed by Pizza Hut.

**Live demo:** https://pizzahut-woad.vercel.app/pizzas

## Features

- Menu browsing with product variants
- Cart management and order creation from the cart
- Saved delivery addresses (with a per-user limit)
- Online payments with Razorpay, including webhook handling for `payment.captured` and `payment.failed`
- Wishlist
- Product reviews and ratings
- Country, state and city location data for addresses
- Email sending through SMTP (Mailtrap in development)
- Responsive UI with form validation and toast notifications
- CI checks for backend and frontend on GitHub Actions

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Python, Django, Django REST Framework |
| Frontend | React, Vite, Redux Toolkit, React Router, React Hook Form, Yup |
| Database | PostgreSQL |
| Payments | Razorpay |
| Email | SMTP (Mailtrap) |
| Hosting | Render (API), Vercel (frontend) |

## Project Structure

```
backend/    Django REST API
frontend/   React app (Vite)
DEPLOY.md   Deployment notes (Render + Vercel)
render.yaml Render blueprint
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- A PostgreSQL database
- A Razorpay test account (for payments)

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirement.txt
```

Set these environment variables (see the table below), then:

```bash
python manage.py migrate
python manage.py import_locations   # loads country/state/city data
python manage.py seed_data          # loads sample menu data
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```
VITE_API_URL=http://127.0.0.1:8000/api/
```

Then run:

```bash
npm run dev
```

## Environment Variables (backend)

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `SECRET_KEY` | Django secret key |
| `ALLOWED_HOSTS` | Allowed hostnames |
| `CORS_ALLOWED_ORIGINS` | Frontend origin(s) |
| `CSRF_TRUSTED_ORIGINS` | Trusted origins |
| `FRONTEND_URL` | Frontend base URL |
| `RAZORPAY_KEY_ID` | Razorpay key id |
| `RAZORPAY_KEY_SECRET` | Razorpay key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret |
| `DEFAULT_FROM_EMAIL` | Sender address |
| `MAILTRAP_HOST`, `MAILTRAP_PORT`, `MAILTRAP_USERNAME`, `MAILTRAP_PASSWORD` | SMTP settings |

Never commit real keys. Use Razorpay test keys for local development.

## Deployment

The backend is deployed on Render, the database on a hosted PostgreSQL service, and the frontend on Vercel. Step-by-step instructions are in [DEPLOY.md](DEPLOY.md).

Razorpay webhook URL: `https://<your-api-host>/api/payments/webhook/`

## Known Limitations and Next Steps

- Uploaded product images are lost on redeploy on the free hosting tier. Plan: move media storage to Cloudinary or similar.
- The Mailtrap sandbox does not deliver to real inboxes. A real SMTP provider is needed for production.
- The free Render tier sleeps after inactivity, so the first request can take about a minute.
- Test files are currently stubs. Next step: add tests for orders and payments.

## Author

Mithalesh Pal
GitHub: https://github.com/mith1995
LinkedIn: https://linkedin.com/in/mithalesh-pal-9aa971145
