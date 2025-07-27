# Test Plan: Notes Application

## 1. Overview

This document outlines the testing strategy for the Notes Application, a full-stack web application built with React frontend and Node.js backend. The testing approach covers both functional UI automation and API testing to ensure comprehensive coverage of user workflows and backend functionality.

**Application Under Test:**
- **Frontend:** React application (port 3000)
- **Backend:** Node.js/Express API (port 5000)
- **Database:** MongoDB
- **Authentication:** JWT-based
- **GitHub Actions:** Implemented, located in the root DIR, workflow file at .github/workflows/test.yml
- **Test framework - Frontend:** Playwright for frontend
- **Test framework - Backend:** Postman/Newman for backend

## 2. What is Being Tested

### 2.1 Frontend Testing (E2E Tests)
- **User Authentication Flows**
  - User registration with form validation
  - Login with valid/invalid credentials
  - Logout functionality
  - Session management and redirects

- **Notes CRUD Operations**
  - Creating new notes with validation
  - Reading/displaying notes list
  - Updating existing notes
  - Deleting notes with confirmation
  - Real-time UI updates after operations

- **User Interface Validation**
  - Form validation and error handling
  - Navigation between pages
  - Responsive design (mobile/desktop)
  - Visual regression testing

### 2.2 Backend Testing (API Tests)
- **Authentication Endpoints**
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User authentication
  - `GET /api/auth/me` - Current user info

- **Notes CRUD Endpoints**
  - `GET /api/notes` - Retrieve notes with pagination/filtering
  - `POST /api/notes` - Create new notes
  - `GET /api/notes/:id` - Get single note
  - `PUT /api/notes/:id` - Update existing notes
  - `DELETE /api/notes/:id` - Delete notes

- **Security Testing**
  - Authorization checks (JWT validation)
  - Access control (users can only access their own notes)
  - Input validation and sanitization

## 3. Test Coverage Areas

### 3.1 Functional Testing
- **Positive Test Cases:** Valid inputs and expected user workflows
- **Negative Test Cases:** Invalid inputs, edge cases, and error scenarios
- **Boundary Testing:** Field length limits, special characters
- **Integration Testing:** Frontend-backend communication

### 3.2 Security Testing
- **Authentication:** Token validation and expiration
- **Authorization:** User data isolation
- **Input Validation:** SQL injection prevention, XSS protection

### 3.3 Performance Testing
- **Response Times:** API endpoint performance metrics
- **Load Testing:** Multiple concurrent user scenarios

### 3.4 UI/UX Testing
- **Cross-browser Compatibility:** Chrome, Firefox, Safari
- **Responsive Design:** Mobile and desktop viewports
- **Visual Regression:** Screenshot comparison testing

## 4. Tools Used and Rationale

### 4.1 Frontend Testing Tools

**Playwright**
- **Why:** Modern, reliable E2E testing framework
- **Capabilities:** Cross-browser testing, screenshot/video capture, debugging tools
- **Coverage:** Complete user workflow automation with visual testing

**Key Features:**
- Automatic waiting and retry mechanisms
- Built-in screenshot and video recording
- Trace viewer for debugging failed tests
- Multi-browser support (Chromium, Firefox, WebKit)

### 4.2 Backend Testing Tools

**Newman (Postman CLI)**
- **Why:** Industry-standard API testing with rich assertion capabilities
- **Capabilities:** Automated API testing with detailed reporting
- **Coverage:** Complete REST API validation with positive/negative scenarios

**Key Features:**
- JSON-based test collections for version control
- Environment variable management
- Rich HTML reporting
- CI/CD pipeline integration

### 4.3 Supporting Tools
- **MongoDB:** In-memory testing database for isolation
- **JWT:** Token-based authentication testing
- **Git:** Version control for test artifacts

## 5. How to Run Tests

### 5.1 Prerequisites
```bash
# Required software
node --version    # 16+
npm --version     # 8+
mongodb --version # 5.0+
```

### 5.2 Setup Commands
```bash
# 1. Clone and install dependencies
cd Node-auto
cd backend && npm install
cd ../frontend && npm install

# 2. Start services
cd backend && npm run dev          # Terminal 1
cd frontend && npm start           # Terminal 2
```

### 5.3 Running Tests

**E2E Tests (Frontend):**
```bash
cd frontend						   # Terminal 3
npm run test:e2e                   # Run all tests
npm run test:e2e:coverage          # View detailed report with code coverage info
```

**API Tests (Backend):**
```bash
cd backend						   # Terminal 4
npm run test:api                   # Run API tests
npm run test:api:html              # Generate HTML report and details
```

### 5.4 Test Reports
- **E2E Report:** `frontend/playwright-report/index.html`
- **API Report:** `backend/test-results/api-report.html`
- **Screenshots/Videos:** `frontend/test-results/`

## 6. Test Metrics and Coverage

### 6.1 Current Test Coverage
- **E2E Tests:** 42 test scenarios
- **API Tests:** 15 endpoint tests
- **Assertion Coverage:** 41+ validation points
- **Browser Coverage:** Chrome, Firefox, Safari
- **Device Coverage:** Desktop and mobile viewports

### 6.2 Success Criteria
- **Pass Rate:** ≥ 95% test pass rate
- **Performance:** API responses < 200ms average
- **Coverage:** All critical user paths tested
- **Visual Regression:** Zero unintended UI changes

## 7. Assumptions and Limitations

### 7.1 Assumptions
- **Environment:** Tests assume local development environment
- **Database:** MongoDB running locally on default port (27017)
- **Network:** Stable localhost network connectivity
- **Browser:** Modern browsers with JavaScript enabled
- **Test Data:** Fresh database state for each test run

### 7.2 Current Limitations
- **Browser Support:** Limited to Chromium, Firefox, WebKit
- **Performance Testing:** Basic response time validation only
- **Security Testing:** Limited to authentication/authorization
- **Mobile Testing:** Simulated viewports only (not real devices)
- **Load Testing:** Single user scenarios only

### 7.3 Future Enhancements
- **Real Device Testing:** Integration with BrowserStack/Sauce Labs
- **Performance Testing:** Load testing with tools like k6 or Artillery
- **Visual Testing:** Enhanced screenshot comparison with Percy/Applitools
- **Security Testing:** Automated vulnerability scanning
- **CI/CD Integration:** GitHub Actions pipeline optimization
