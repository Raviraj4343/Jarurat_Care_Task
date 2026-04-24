# Jarurat Care

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Build](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![ODM](https://img.shields.io/badge/ODM-Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

Jarurat Care is a production-minded MERN mini healthcare support web app for NGOs that collect patient and volunteer support requests, save them to MongoDB, and generate a constrained AI summary from the submitted text.

## Key Highlights

- MERN-based full-stack healthcare support intake app
- Cleanly separated frontend and backend architecture
- Gemini-powered structured AI summary with strict prompt constraints
- Form validation on both frontend and backend
- Centralized error handling and consistent API responses
- Scrollable submitted-request dashboard with search and filters
- Environment-based configuration for secure secret handling

## Tech Stack

- Frontend: React with Vite
- Backend: Node.js, Express, Mongoose
- Database: MongoDB
- AI: Gemini API via Google GenAI SDK with structured JSON output

## NGO Use-Case

An NGO can use this app to intake healthcare-related support needs from patients and volunteers, organize requests centrally, and quickly review a short AI-assisted summary without losing the original message context.

## Architecture Overview

The project is split into two independently runnable applications:

- `Frontend/` contains the React client built with reusable components, a hooks-based state layer, and a small API abstraction layer.
- `Backend/` contains the Express API with modular folders for routes, controllers, services, middleware, validators, and database models.

### Backend Flow

1. A client submits a support request to the Express API.
2. Request validation runs before controller logic.
3. The controller delegates business logic to the service layer.
4. The service generates an AI summary and stores the request in MongoDB.
5. The API returns a structured success or error response.

### Frontend Flow

1. The user fills out the healthcare support form.
2. Client-side validation checks the input before submission.
3. The request is sent through a dedicated API service.
4. Loading, success, and error states are handled through a custom hook.
5. Submitted requests are rendered in a scrollable list with filters.

## Project Structure

```text
Backend/
  src/
    config/        # environment and database setup
    controllers/   # request handlers
    middleware/    # error, validation, not-found handling
    models/        # mongoose schemas
    routes/        # express route modules
    services/      # business logic and Gemini integration
    utils/         # shared helpers and response utilities
    validators/    # request validation logic
Frontend/
  src/
    api/           # HTTP client and API methods
    components/    # reusable UI components
    hooks/         # stateful frontend logic
    pages/         # page-level composition
    styles/        # global styles
```

## AI Feature

The backend sends only the submitted role, support type, and message to the AI service. The model is instructed to return:

- `issueSummary`
- `category` as `mild`, `urgent`, or `unknown`
- `suggestion`

The prompt explicitly tells the model to use only the provided input and not introduce extra facts or inferred medical claims. If the AI service is unavailable, the backend falls back to a minimal manual-safe summary so submissions still succeed.

## API Documentation

Base URL:

```text
http://127.0.0.1:5000/api
```

### Health Check

`GET /health`

Purpose:
Check whether the backend is running successfully.

Example response:

```json
{
  "success": true,
  "message": "Backend is healthy"
}
```

### Get All Support Requests

`GET /support-requests`

Purpose:
Fetch all submitted support requests, sorted by newest first.

Example response:

```json
{
  "success": true,
  "message": "Support requests fetched successfully",
  "data": []
}
```

### Submit Support Request

`POST /support-requests`

Purpose:
Create a new healthcare support request and generate its AI summary.

Sample request body:

```json
{
  "fullName": "Ravi Kumar",
  "email": "ravi@example.com",
  "phone": "9876543210",
  "role": "patient",
  "location": "Patna, Bihar",
  "supportType": "medical",
  "requestPriority": "urgent",
  "message": "I need help arranging medicine and a doctor consultation for recurring fever.",
  "consent": true
}
```

Successful response:

```json
{
  "success": true,
  "message": "Support request submitted successfully",
  "data": {
    "_id": "661234567890abcdef123456",
    "fullName": "Ravi Kumar",
    "email": "ravi@example.com",
    "phone": "9876543210",
    "role": "patient",
    "location": "Patna, Bihar",
    "supportType": "medical",
    "requestPriority": "urgent",
    "message": "I need help arranging medicine and a doctor consultation for recurring fever.",
    "consent": true,
    "aiSummary": {
      "issueSummary": "The patient needs help arranging medicine and a doctor consultation for recurring fever.",
      "category": "mild",
      "suggestion": "Arrange medicine support and a doctor consultation."
    },
    "createdAt": "2026-04-24T09:56:42.698Z",
    "updatedAt": "2026-04-24T09:56:42.698Z"
  },
  "error": null
}
```

Validation error response shape:

```json
{
  "success": false,
  "message": "Validation failed",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": [
      "A valid email address is required."
    ]
  }
}
```

## Design Decisions

- Modular backend structure was chosen to keep controllers thin and business logic reusable.
- Request validation exists on both frontend and backend to improve UX while still protecting the API.
- The frontend uses a dedicated API service layer so UI components stay focused on rendering.
- The AI service is isolated in its own backend service to keep external provider logic separate from core request handling.
- Structured JSON output was used for the AI summary to make frontend rendering predictable.
- A safe fallback summary is returned when the AI provider fails so the NGO intake flow does not break.
- Filtering and scrolling were added to the submitted-requests section so the interface stays usable as records grow.

## Deployment Notes

This project can be deployed as two separate services:

- Frontend: Vercel, Netlify, or any static hosting platform that supports Vite builds
- Backend: Render, Railway, Cyclic, or any Node.js hosting platform
- Database: MongoDB Atlas for a managed production database

### Recommended Deployment Setup

- Deploy the backend first and expose the `/api` routes publicly.
- Set `CLIENT_URL` in the backend environment to the deployed frontend URL.
- Set `VITE_API_BASE_URL` in the frontend environment to the deployed backend API URL.
- Store `MONGODB_URI` and `GEMINI_API_KEY` only in deployment environment variables, never in source control.

### Production Considerations

- Add rate limiting for public form submissions
- Add request logging and monitoring
- Restrict CORS to known frontend origins
- Use HTTPS-only deployments
- Add authentication if NGO staff-only dashboard features are introduced later

## Environment Setup

### Backend

Copy `Backend/.env.example` to `Backend/.env` and configure:

- `PORT`
- `MONGODB_URI`
- `CLIENT_URL`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`

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
