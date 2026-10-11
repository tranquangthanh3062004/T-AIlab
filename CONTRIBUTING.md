# Contributing to T AIlab (CHINAI AI Learning OS)

Thank you for your interest in contributing to **T AIlab**! We follow senior engineering standards to maintain high code quality, security, and educational clarity across our bilingual (Vietnamese & English) AI learning platform.

---

## Development Setup

### Prerequisites
- **Python 3.11+**
- **Node.js 20+** and `npm`
- **Git**

### 1. Backend Setup
```bash
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev -- --port 5173
```

---

## Commit Message Convention

We strictly follow the **[Conventional Commits](https://www.conventionalcommits.org/)** specification:

- `feat(scope):` A new feature (e.g., `feat(curriculum): add beginner intuition tracks`)
- `fix(scope):` A bug fix (e.g., `fix(theme): add Tailwind v4 dark custom variant`)
- `security(scope):` Security hardening (e.g., `security(sandbox): enforce AST dunder blocking`)
- `test(scope):` Adding or updating automated tests
- `docs(scope):` Documentation updates
- `ci(scope):` Continuous integration & deployment workflows
- `chore(scope):` Build scripts, dependencies, or tooling

---

## Quality Gates Before Submitting a PR

1. **Backend Test Suite**: Run `pytest -v` in `backend/` and ensure 100% pass rate.
2. **Frontend Typecheck & Build**: Run `npm run build` in `frontend/` with zero TypeScript or Vite errors.
3. **Bilingual Parity**: Any new UI strings or curriculum lessons must include both Vietnamese (`vi`) and English (`en`) translations.
4. **Mathematical Clarity**: Any new formulas in `FormulaGuide` or curriculum blocks must define every mathematical symbol clearly in the symbol legend.
