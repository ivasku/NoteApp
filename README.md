# Notes App - Full Stack with Testing

A complete notes application with React frontend, Node.js backend, and comprehensive testing suite. 

* Using Playwright we are testing frontend and providing code coverage.
* Implemented test script to integrate into a GitHub Action/CI pipeline, workflow file at .github/workflows/test.yml
* Backend tests using Postman/Newman

***Inside the Sample reports directory there are test reports for your reference that were runned on my machine***

## ⚡ Quick Start (2 minutes)

### Prerequisites
- Node.js 16+ 
- MongoDB installed and running

### 1. Clone and Install
```bash
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
```

### 2. Setup Environment
```bash
# Backend config
echo "MONGODB_URI=mongodb://localhost:27017/notesapp
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000" > backend/.env

# Frontend config  
echo "REACT_APP_API_URL=http://localhost:5000/api" > frontend/.env
```

### 3. Start Application
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

**🎉 App running at:** http://localhost:3000

## 🧪 Run Tests

### E2E Tests (Frontend)
```bash
# Terminal 3: Frontend
cd frontend
npx playwright install      # One-time setup
npm run test:e2e            # Run all tests
npm run test:e2e:coverage   # View results  
```

### API Tests (Backend)
```bash
# Terminal 4: Frontend
cd backend
npm install --save-dev newman-reporter-htmlextra  # One-time setup
npm run test:api            # Run API tests
npm run test:api:html       # HTML report
```

## 📁 Project Structure
```
notes-app/
├── backend/           # Node.js API
│   ├── models/        # MongoDB models
│   ├── routes/        # API routes
│   ├── tests/         # Postman collections
│   └── server.js      # Main server
├── frontend/          # React app
│   ├── src/           # Components & logic
│   ├── tests/         # Playwright tests
│   └── public/        # Static files
└── .github/           # CI/CD workflows
```

## 🔧 Available Scripts

**Backend:**
- `npm run dev` - Start development server
- `npm run test:api` - Run API tests
- `npm run test:api:html` - API tests with HTML report

**Frontend:**
- `npm start` - Start React app
- `npm run test:e2e` - Run E2E tests
- `npm run test:e2e:coverage` - Tests with browser visible
- `npm run test:auth` - Authentication tests only
- `npm run test:notes` - Notes CRUD tests only
- `npm run test:visual` - Visual regression tests

## ✅ What's Tested

**E2E Tests (42 scenarios):**
- ✅ User registration & login
- ✅ Notes CRUD operations
- ✅ Visual regression testing
- ✅ Mobile responsive design

**API Tests (15 endpoints):**
- ✅ Authentication endpoints
- ✅ Notes CRUD with validation
- ✅ Security & authorization
- ✅ Error handling

## 🚀 Features

- **Authentication:** JWT-based login/register
- **Notes Management:** Create, read, update, delete notes
- **Categories & Importance:** Organize and prioritize notes
- **Search & Filter:** Find notes quickly
- **Responsive Design:** Works on all devices
- **Real-time Updates:** Instant UI feedback

## 🛠️ Tech Stack

**Frontend:**
- React 19
- React Router
- Axios
- CSS3

**Backend:**
- Node.js
- Express
- MongoDB
- JWT
- bcryptjs

**Testing:**
- Playwright (E2E)
- Newman/Postman (API)
- GitHub Actions (CI)
- Code coverage reports (visible inside the console when tests are runned)

## 📊 Test Reports

After running tests, view reports:
- **E2E Report:** `frontend/playwright-report/index.html`
- **API Report:** `backend/test-results/api-report.html`

## 🐛 Troubleshooting

**MongoDB not running:**
```bash
# Windows
net start MongoDB

# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

**Port conflicts:**
```bash
npx kill-port 3000  # Frontend
npx kill-port 5000  # Backend
```

**Clear test data:**
```bash
mongosh
use notesapp
db.dropDatabase()
```

## 📚 Documentation

- [Test Plan](Test-Plan.md) - Comprehensive testing strategy

## 🔄 CI/CD

Tests run automatically on:
- Every push to main branch
- Pull requests
- View results in GitHub Actions tab

