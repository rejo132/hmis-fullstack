# HMIS Fullstack  

A comprehensive Hospital Management Information System (HMIS) combining a Flask REST API backend and a modern React frontend. This monorepo is designed for easy development, deployment, and collaboration.

---

## 🏗️ Monorepo Structure
```
hmis-fullstack/
├── backend/   # Flask REST API
├── frontend/  # React App (Create React App)
├── .gitignore
├── LICENSE
├── README.md  # (this file)
└── (optional: docker-compose.yml, root scripts, etc.)
```

---

## 🚀 Quick Start (Development)

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm 8+
- (Recommended) Docker & Docker Compose

### 1. Clone the Repository
```bash
git clone https://github.com/rejo132/hmis-fullstack.git
cd hmis-fullstack
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python init_db.py
python seed.py
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Run Both Apps (in separate terminals)
```bash
# Terminal 1 (Backend)
cd backend
source venv/bin/activate
python run.py

# Terminal 2 (Frontend)
cd frontend
npm start
```
- Backend: http://localhost:5000
- Frontend: http://localhost:3000



## 🩺 Backend (Flask API)

A comprehensive REST API for hospital management, including:
- User management (multi-role)
- Patient management
- Medical records
- Appointments
- Billing
- Laboratory & radiology
- Inventory & pharmacy
- HR & finance
- Security & audit logging

### Key Files & Folders
- `src/` - Main API code (components, slices)
- `tests/` - Pytest-based tests
- `requirements.txt` - Python dependencies
- `run.py` - App entry point
- `init_db.py`, `seed.py`, `reset_db.py` - DB scripts

### API Usage
- JWT authentication
- RESTful endpoints (see backend/README.md for full list)
- Example:
  ```bash
  curl -X POST http://localhost:5000/api/login \
    -H "Content-Type: application/json" \
    -d '{"username": "admin", "password": "password123"}'
  ```

### Environment Variables
- `DATABASE_URL` (default: SQLite, production: PostgreSQL recommended)
- `FLASK_ENV`
- `JWT_SECRET_KEY`, `SECRET_KEY`

---

## 💻 Frontend (React)

A modern React app bootstrapped with Create React App, featuring:
- Role-based dashboards and navigation
- Patient, appointment, billing, and lab management UIs
- Responsive, mobile-friendly design
- State management with Redux
- E2E tests with Cypress

### Key Files & Folders
- `src/` - React components, slices, hooks
- `public/` - Static assets
- `cypress/` - E2E tests
- `package.json` - npm scripts and dependencies

### Common Scripts
```bash
npm start        # Run dev server
npm test         # Run tests
npm run build    # Production build
```

---

## 🛡️ Best Practices & Recommendations
- **Use Docker Compose** for local and production deployments
- **Environment variables**: Use `.env` files for secrets/config
- **CI/CD**: Add GitHub Actions for automated testing and deployment
- **Database**: Use PostgreSQL in production (see backend/README.md)
- **Security**: Change all default passwords and secrets before deploying
- **Testing**: Use `pytest` for backend, `npm test` and `cypress` for frontend
- **Documentation**: Keep this README and API docs up to date

---

## 🤝 Contributing
1. Fork the repo
2. Create a feature branch
3. Commit your changes
4. Open a pull request

---

## 📄 License
This project is licensed under the MIT License.

---

## 🆘 Support
- Open an issue on GitHub for bugs or questions
- See `backend/TROUBLESHOOTING.md` for backend help
- See comments in code for usage examples

---

**Built with ❤️ for better healthcare management** 
