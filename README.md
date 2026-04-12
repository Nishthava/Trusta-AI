# Trusta-AI

Trusta AI is a real-time UPI fraud prevention system that uses AI-driven behavioral analysis and anomaly detection to identify and stop fraudulent transactions before they occur. 

## Features

- **Agentic Interface**: Modern, dark-themed React UI that provides step-by-step reasoning and real-time feedback on transaction processing.
- **Dual-Layer Risk Evaluation**: 
  - **Client-Side Engine**: Instant, zero-latency heuristic checks (transaction velocity, geographic anomaly, device identification, receiver history) for immediate UI feedback.
  - **Backend Scoring**: Persists transaction properties to a MySQL database and mirrors the engine's functionality for robust tracking.
- **Automated Fraud Prevention**: Transactions are scored dynamically. Depending on the threshold, transactions evaluate to:
  - `ALLOW` (Safe)
  - `WARN` (OTP request recommended)
  - `BLOCK` (High risk / Fraudulent)

## Tech Stack

**Frontend:**
- React + Vite
- CSS Modules & Glassmorphism UI
- Hosted on [Vercel](https://trusta-ai-1-chi.vercel.app/)

**Backend:**
- FastAPI (Python)
- MySQL (via `mysql-connector-python`)
- Hosted on [Railway](https://melodious-adventure-production.up.railway.app/)

## Project Structure

```text
Trusta-AI/
├── Backend/           # FastAPI server
│   ├── app.py         # Entry point & CORS setup
│   ├── db.py          # MySQL database connection wrapper
│   ├── routes/        # API endpoints (e.g., POST /api/analyze)
│   └── services/      # Python risk engine logic
├── Front End/         # React SPA
│   ├── src/           # UI components, assets, and client-side risk engine
│   └── package.json   # Dependencies and run scripts
└── vercel.json        # Root-level Vercel deployment configuration
```

## Running Locally

### 1. Backend Setup

1. Navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Create and activate a virtual environment (recommended):
   ```bash
   python -m venv venv
   source venv/bin/activate  # Mac/Linux
   # venv\Scripts\activate   # Windows
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Set up the environment variables (create a `.env` file referencing `.env.example`):
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=Trusta_AI
   ```
5. Start the API server:
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

### 2. Frontend Setup

1. Navigate to the `Front End` directory:
   ```bash
   cd "Front End"
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file pointing to either the local backend or the production server:
   ```env
   # Local testing
   VITE_API_URL=http://localhost:8000
   
   # Or use production (Railway)
   # VITE_API_URL=https://melodious-adventure-production.up.railway.app
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Deployments

- Updates to `main` branch trigger automated deployments on **Vercel** (for the `Front End` folder, configured via `vercel.json`) and **Railway** (for the `Backend` directory, configured via `Procfile`).
