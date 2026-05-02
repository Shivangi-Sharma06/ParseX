# ResumeIQ

ResumeIQ is a recruiter-focused resume parsing and candidate matching platform that turns incoming resumes into ranked shortlists in seconds. It combines document extraction, job requirement matching, secure authentication, and analytics so hiring teams can move from manual screening to a repeatable workflow.

## What It Does

ResumeIQ helps recruiters and hiring teams:

- Upload PDF or DOCX resumes and extract candidate details automatically.
- Create job requirements with the skills that matter for each role.
- Run matching to rank candidates against a job description.
- Shortlist candidates and send shortlist emails from the app.
- Track activity and hiring insights with analytics dashboards and charts.

## Key Features

### Resume Parsing

- Supports PDF and DOCX uploads.
- Extracts skills, education, experience, and contact details from resumes.
- Stores candidate profiles for later review and matching.

### Smart Candidate Matching

- Compares candidate skills with job requirements.
- Produces ranked match results so recruiters can focus on the best-fit profiles first.
- Keeps match records for each job and candidate pair.

### Shortlisting and Email Workflow

- Mark candidates as shortlisted with one action.
- Send shortlist emails directly from the matching flow.
- Email shortlisted candidates individually or in bulk for a job.

### Recruiter Dashboard

- See total uploads, active jobs, top match score, and shortlist counts at a glance.
- Review recent activity across uploads, jobs, and matching.
- Jump straight to the most important next action with quick links.

### Analytics and Insights

- Visualize resume volume over time.
- View skill distribution across your candidate pool.
- Inspect match score distribution.
- Spot skills gaps by comparing job requirements and available talent.
- Load sample analytics data when you want a fast demo or empty-state walkthrough.

### Authentication and Access Control

- Register and log in with JWT-based authentication.
- Protect recruiter data behind authenticated routes.
- Keep each recruiter’s candidates, jobs, and matches scoped to their account.

### Demo-Friendly Experience

- When the database is unavailable, the app can surface demo data so the UI still feels usable.
- This makes ResumeIQ easy to explore locally, present in demos, or use as a starter product.

## Unique Selling Points

ResumeIQ stands out because it is built around the actual recruiter workflow, not just document extraction. It does four things especially well:

- It turns raw resumes into structured profiles with minimal manual effort.
- It ranks candidates against a role instead of leaving recruiters with a flat pile of profiles.
- It includes shortlist communication, so selection and outreach stay in one place.
- It pairs a polished recruiter dashboard with analytics that make the pipeline easier to understand.

In short: ResumeIQ is designed to reduce screening time, make matching more consistent, and keep the hiring workflow moving.

## Tech Stack

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication
- Multer for resume uploads
- PDF and DOCX parsing
- Nodemailer for shortlist emails

### Frontend

- React 19
- Vite
- React Router
- Tailwind CSS
- Framer Motion
- Recharts
- Axios

## Project Structure

The repository is split into two apps:

- `backend/` for the API, matching engine, resume parsing, and email workflow.
- `frontend/` for the recruiter dashboard and user-facing UI.

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB connection string
- A `.env` file for the backend

### 1. Install Dependencies

From the project root, install both apps separately:

```bash
cd backend
npm install

cd ../frontend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file inside `backend/` with the values your deployment needs. A typical local setup looks like this:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
CLIENT_URL=http://localhost:5173
GROQ_API_KEY=optional_ai_key_for_candidate_analysis
GROQ_MODEL=llama-3.3-70b-versatile
```

If you want shortlist emails to be delivered through a real mailbox, configure the email service credentials used by the backend as well.

### 3. Run the Backend

```bash
cd backend
npm run dev
```

The API runs on `http://localhost:5000` by default.

### 4. Run the Frontend

```bash
cd frontend
npm run dev
```

The UI runs on `http://localhost:5173` by default.

## Useful Scripts

### Backend

- `npm run dev` starts the API with nodemon.
- `npm start` runs the production server.

### Frontend

- `npm run dev` starts the Vite dev server.
- `npm run build` creates a production build.
- `npm run lint` checks the frontend codebase with ESLint.
- `npm run preview` previews the production build locally.

## API Overview

The backend exposes routes for:

- Authentication: register, login, and current-user profile.
- Candidates: create, list, upload resumes, analyze profiles, fetch resume files, and delete candidates.
- Jobs: create, update, list, and delete job requirements.
- Matches: run matching, fetch results, shortlist candidates, and send shortlist emails.

## Why Teams Use ResumeIQ

ResumeIQ is a strong fit for teams that need to screen candidates quickly without sacrificing structure or consistency. It reduces repetitive manual review, keeps recruiter decisions centralized, and turns a resume pile into an ordered pipeline of match-ready candidates.

