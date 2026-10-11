# Deployment & Operational Runbook — AI Learning OS

**Version**: 1.0.0  
**Status**: Active  
**Author**: DevOps/SRE Engineer

---

## 1. Local Development Quickstart

### Prerequisites
- Node.js >= 20.0 (v24.16 installed)
- Python >= 3.11 (Python 3.13.7 installed)

### Backend Service (FastAPI)
```bash
cd backend
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
.\venv\Scripts\python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Frontend Development Server (Vite)
```bash
cd frontend
npm install
npm run dev
# Accessible at http://localhost:5173
```

---

## 2. Production Containerization Blueprint

### Multi-stage Dockerfile (Backend)
```dockerfile
FROM python:3.13-slim as backend
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Health Check Endpoint
- Path: `GET /api/health`
- Expected Response: `{"status": "healthy", "service": "ai-learning-os", "version": "1.0.0"}`
