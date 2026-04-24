# Jarurat Care

Jarurat Care is a production-minded MERN mini healthcare support web app for NGOs that collect patient and volunteer support requests, save them to MongoDB, and generate a constrained AI summary from the submitted text.

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- AI: OpenAI Responses API with structured JSON output

## NGO Use-Case

An NGO can use this app to intake healthcare-related support needs from patients and volunteers, organize requests centrally, and quickly review a short AI-assisted summary without losing the original message context.

## AI Feature

The backend sends only the submitted role, support type, and message to the AI service. The model is instructed to return:

- `issueSummary`
- `category` as `mild`, `urgent`, or `unknown`
- `suggestion`

The prompt explicitly tells the model to use only the provided input and not introduce extra facts or inferred medical claims. If the AI service is unavailable, the backend falls back to a minimal manual-safe summary so submissions still succeed.

## Project Structure

```text
Backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    services/
    utils/
    validators/
Frontend/
  src/
    api/
    components/
    hooks/
    pages/
    styles/
```

## Environment Setup

### Backend

Copy `Backend/.env.example` to `Backend/.env` and configure:

- `PORT`
- `MONGODB_URI`
- `CLIENT_URL`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`

### Frontend

Copy `Frontend/.env.example` to `Frontend/.env` and configure:

- `VITE_API_BASE_URL`

## Run Locally

Install dependencies in both apps, then start them in separate terminals:

```bash
cd Backend
npm install
npm run dev
```

```bash
cd Frontend
npm install
npm run dev
```

The frontend expects the backend on `http://127.0.0.1:5000` by default.
