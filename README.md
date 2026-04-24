# Jarurat Care

![Frontend](https://img.shields.io/badge/Frontend-React-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Build](https://img.shields.io/badge/Build-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Framework](https://img.shields.io/badge/Framework-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Database](https://img.shields.io/badge/Database-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![ODM](https://img.shields.io/badge/ODM-Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white)
![AI](https://img.shields.io/badge/AI-Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)

Assessment submission project for internship evaluation: a production-style MERN healthcare support intake app where patients and volunteers can submit support requests, which are stored in MongoDB and summarized using constrained AI output.

## Live Demo

- Frontend (Vercel): https://jct-theta.vercel.app
- Backend API (Render): https://jarurat-care-task-j4h4.onrender.com
- Health endpoint: https://jarurat-care-task-j4h4.onrender.com/api/health

## Reviewer Quick Check (2 minutes)

1. Open the frontend live link.
2. Submit a test request from the form.
3. Confirm the request appears in Submitted requests.
4. Confirm AI summary fields appear: issueSummary, category, suggestion.
5. Open the health endpoint to verify backend availability.

## Key Highlights

- Full-stack MERN architecture with clear frontend and backend separation
- Structured AI summary generation with safe fallback behavior
- Validation on both client and server
- Search and filter-enabled request dashboard
- Centralized API response and error handling
- Deployment-ready environment configuration and CORS controls

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express + Mongoose
- Database: MongoDB Atlas
- AI: Google Gemini (via @google/genai)

## Problem Statement

NGOs often receive scattered healthcare support requests from patients and volunteers. This app centralizes intake, preserves original context, and adds a short AI-generated summary to help triage quickly.

## Architecture Overview

### Frontend

- Reusable form and UI components
- Custom hooks for theme and request state management
- API abstraction layer with resilient base URL handling

### Backend

- Layered structure: routes, controllers, services, validators, middleware
- MongoDB persistence using Mongoose models
- AI service isolated from request orchestration
- Configurable CORS for production deployment scenarios

## Project Structure

~~~text
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
~~~

## API Endpoints

Base URL (production): https://jarurat-care-task-j4h4.onrender.com/api

- GET /health
- GET /support-requests
- POST /support-requests

Sample success response shape:

~~~json
{
  "success": true,
  "message": "Support request submitted successfully",
  "data": {
    "fullName": "Ravi Kumar",
    "role": "patient",
    "supportType": "medical",
    "message": "...",
    "aiSummary": {
      "issueSummary": "...",
      "category": "mild",
      "suggestion": "..."
    }
  },
  "error": null
}
~~~

## AI Summary Design

The backend sends only relevant request context to the model and expects a strict structured output:

- issueSummary
- category: mild or urgent or unknown
- suggestion

If AI fails, the request still gets saved with a safe fallback summary so the intake flow does not break.

## Local Setup

### 1) Backend

Copy Backend/.env.example to Backend/.env and set:

- PORT
- MONGODB_URI
- CLIENT_URL
- CLIENT_URLS (comma-separated allowed origins, optional)
- GEMINI_API_KEY
- GEMINI_MODEL

Run:

~~~bash
cd Backend
npm install
npm run dev
~~~

### 2) Frontend

Copy Frontend/.env.example to Frontend/.env and set:

- VITE_API_BASE_URL

Run:

~~~bash
cd Frontend
npm install
npm run dev
~~~

## Deployment Summary

### Frontend (Vercel)

- Root directory: Frontend
- Build command: npm run build
- Output directory: dist
- Environment variable:
  - VITE_API_BASE_URL=https://jarurat-care-task-j4h4.onrender.com

### Backend (Render)

- Root directory: Backend
- Build command: npm install
- Start command: npm start
- Environment variables:
  - NODE_ENV=production
  - MONGODB_URI=your_mongodb_uri
  - GEMINI_API_KEY=your_key
  - GEMINI_MODEL=gemini-2.5-flash
  - CLIENT_URL=https://jct-theta.vercel.app
  - CLIENT_URLS=https://jct-theta.vercel.app,https://jct-3unrgwsr8-ravis-projects-ac4ec6cb.vercel.app

## Engineering Decisions

- Kept controllers thin and moved orchestration into services
- Implemented defensive frontend API URL normalization and retry behavior
- Added multi-origin aware CORS handling for Vercel production and preview domains
- Preserved consistent API response shape for reliable frontend rendering

## Notes For Evaluators

- This implementation focuses on code clarity, reliability in deployment, and practical production concerns (validation, error handling, CORS, env management).
- The app is intentionally scoped and modular to make future features easy to add (auth, staff dashboard, rate limiting, audit logs).
