# 🚀 KaushalAI (कौशलएआई)

<div align="center">

### Empowering the Hands That Build Bharat 🇮🇳

**An AI-powered multilingual workforce platform helping vocational workers build trusted digital identities, validate skills, earn certifications, and access better employment opportunities.**

</div>

---

## 📖 Overview

India's skilled workforce powers construction sites, factories, workshops, homes, and critical infrastructure across the country. Despite years of practical expertise, millions of vocational workers remain underserved by traditional hiring systems due to the absence of formal certifications, professional resumes, and digital visibility.

**KaushalAI** addresses this challenge by combining Artificial Intelligence, multilingual accessibility, skill verification, and employment tools into a single platform designed specifically for India's vocational workforce.

The platform enables workers to showcase real-world skills, earn verifiable credentials, build professional profiles, and connect directly with employers.

---

## 🔄 How It Works: Platform Workflows

KaushalAI operates on a dual-sided marketplace model, catering to both **Workers** and **Employers** with tailored user journeys.

### 👷 Worker Journey
1. **Onboarding & Profiling**: Workers register using their mobile numbers. The interface is available in multiple local languages (Hindi, Marathi, etc.) to ensure accessibility.
2. **AI-Powered Assessment**: Instead of written exams, workers interact with an AI chatbot powered by Google Gemini. The AI asks practical, scenario-based questions in their chosen language based on their trade (e.g., Electrician, Welder).
3. **Skill Validation & Certification**: Based on the chat, the AI grades the worker (Beginner, Intermediate, Advanced). A verifiable digital certificate with a unique QR code is generated instantly.
4. **AI Resume Generation**: The platform automatically compiles the worker's profile, assessment results, and certifications into a professionally formatted, ATS-friendly resume.
5. **Job Discovery & Application**: Workers can browse the Job Marketplace, match with jobs suited to their skill level, and apply with a single click.

### 🏢 Employer Journey
1. **Corporate Registration**: Employers register their companies, providing GST and industry details to establish authenticity.
2. **Talent Acquisition**: Employers can post job openings specifying required trades and minimum skill levels.
3. **Applicant Tracking System (Kanban)**: Employers manage applications through a visual Kanban board (Applied → Shortlisted → Interview → Hired).
4. **Verification**: Employers can scan a worker's KaushalAI QR code to instantly verify their identity, skill level, and assessment history, ensuring trustworthy hiring.

---

## 🧠 Technical & Functional Implementation

### 1. AI Assessment Engine
The core of KaushalAI is its dynamic assessment engine. 
- **Prompt Engineering**: The backend utilizes system prompts to instruct Google Gemini to act as an expert vocational examiner.
- **Adaptive Questioning**: The AI evaluates the worker's text or voice-to-text inputs and adjusts the difficulty of subsequent questions.
- **Structured Output Generation**: The AI ultimately returns a structured JSON payload containing the user's `skillLevel`, `strengths`, `gaps`, and a `recommendedCourse`, which is saved directly to MongoDB.

### 2. High-Fidelity Certificate Generation
To bridge the gap between digital and physical credentials, the platform generates authentic, print-ready certificates.
- **Client-Side Rendering**: Uses React components combined with strict inline CSS and Hex colors to prevent theme (Dark Mode) overriding.
- **html2canvas & jsPDF**: The DOM element is captured at 2x scale and converted into a landscape A4 PDF.
- **QR Code Integration**: `react-qr-code` embeds a unique `/verify/:uuid` link directly on the document.

### 3. Secure Authentication System
- **Dual-Role Architecture**: Distinguishes between `User` (Worker) and `Employer` schemas.
- **JWT & HTTP-Only Cookies**: Tokens are securely stored in cookies (`sameSite: 'Lax'`, `httpOnly: true`) to prevent XSS attacks.
- **Middleware Protection**: Express middleware intercepts requests, decodes JWTs, and enforces role-based access (`workerOnly`, `employerOnly`).
- **Rate Limiting**: Critical endpoints like `/login` and `/register` are rate-limited to prevent brute-force attacks.

### 4. Database Architecture (MongoDB)
- **Users / Employers**: Stores profile data, auth credentials, and preferences.
- **Assessments**: Links AI evaluation results to the respective User.
- **Courses & Enrollments**: Stores curriculum modules and tracks worker progress (gamified learning).
- **Jobs & Applications**: Relational structure where Applications tie Users to Jobs and Employers, tracking status transitions.

---

## ✨ Key Features

### 🤖 AI-Powered Skill Assessment
* Dynamic AI-driven questioning (Powered by Gemini 2.5 Flash)
* Scenario-based practical evaluations
* Instant performance feedback & personalized recommendations

### 🌐 Multilingual Experience
* Support for 🇮🇳 Hindi, 🇮🇳 Marathi, and 🇬🇧 English via `i18next`.
* Workers can learn, interact, and complete assessments in their native tongue.

### 📄 AI Resume Generator
* Transforms worker profiles and assessment data into Markdown-based, professional layouts.
* Easy export and sharing capabilities.

### 🏆 QR-Based Certificate Verification
* Auto-generated, high-resolution PDF certificates.
* Unique cryptographic UUIDs for instant employer authenticity checks.

### 💼 Job Marketplace & Kanban Tracker
* Skill-based matchmaking connecting verified workers directly with employers.
* Intuitive drag-and-drop Kanban board for employer recruitment pipelines.

---

## 🏗️ System Architecture

```text
┌─────────────────────────┐
│     React Frontend      │
│  (Vite, Tailwind, i18n) │
└──────────┬──────────────┘
           │ HTTPS / REST
           ▼
┌─────────────────────────┐
│    Express Backend      │
│ (JWT, Rate Limiting)    │
└────┬───────────────┬────┘
     │               │
     ▼               ▼
┌─────────┐     ┌────────────┐
│ MongoDB │     │ Gemini API │
│(Mongoose)     │ (AI Engine)│
└─────────┘     └────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React.js, Vite
* **Styling**: Tailwind CSS, Lucide React icons
* **Routing & State**: React Router
* **Internationalization**: i18next
* **Utilities**: html2canvas, jsPDF, react-qr-code, react-markdown

### Backend
* **Server**: Node.js, Express.js
* **Authentication**: JSON Web Tokens (JWT), bcrypt, cookie-parser
* **AI Integration**: `@google/genai` (Gemini 1.5/2.5 Flash)
* **Security**: express-rate-limit, cors

### Database
* **Database**: MongoDB
* **ODM**: Mongoose

---

## 🎨 Design System

Built for outdoor visibility, low-end devices, and maximum readability.

| Component        | Color     | Hex       |
| ---------------- | --------- | --------- |
| Primary Navy     | Deep Blue | `#1A56A0` |
| Accent Gold      | Orange    | `#F4A223` |
| Deep Navy Text   | Dark Slate| `#1A1A2E` |
| White Background | Pure White| `#FFFFFF` |

### Design Principles
* **Mobile-First**: Optimized for mobile screens as the primary device for workers.
* **High Contrast**: Ensuring readability under direct sunlight on construction sites.
* **Accessibility Focused**: Simple iconography and native language fonts (Devanagari, etc.).

---

## 📂 Project Structure

```bash
KaushalAI/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Cards)
│   │   ├── pages/          # Route-based views (Dashboards, Chat, Auth)
│   │   ├── hooks/          # Custom React hooks (useAuth)
│   │   ├── utils/          # API interceptors and helpers
│   │   └── i18n/           # Language translation files
│   └── package.json
│
├── server/                 # Backend Express Application
│   ├── controllers/        # Business logic (auth, courses, ai, jobs)
│   ├── middleware/         # JWT verification, error handling, rate limits
│   ├── models/             # Mongoose schemas (User, Employer, Job, etc.)
│   ├── routes/             # API route definitions
│   ├── utils/              # Seeding scripts and DB fixes
│   └── package.json
│
├── README.md               # Project documentation
└── .env                    # Environment variables
```

---

## ⚙️ Installation & Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/KaushalAI.git
cd KaushalAI
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `server/.env` file:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```
Run Backend & Seed Database:
```bash
node utils/seed.js  # Optional: Seeds database with initial courses
npm run dev
```

### 3. Frontend Setup
```bash
cd client
npm install
```
Create a `client/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```
Run Frontend:
```bash
npm run dev
```

---

## 🔮 Future Roadmap

### Phase 2: Voice & Accessibility
* Voice-Based Assessments (Speech-to-Text evaluation)
* Audio navigation for non-literate users
* Additional Indian Regional Languages

### Phase 3: Institutional Integration
* Government Skill Development Integration
* National Digital Skill Passport
* Blockchain-Based Credential Verification

### Phase 4: Advanced AI
* AI Job Matching Engine based on granular skill gaps
* Workforce Demand Forecasting for employers
* Offline-First Mobile Application

---

## 👨‍💻 Developed By

### Rishabh
**Software Developer | MERN Stack Developer**

Building technology that creates measurable social impact through AI, accessibility, and trust.

---

## 📜 License

This project is licensed under the MIT License.

---

<div align="center">

### 🇮🇳 Skills Should Be Recognized By Capability, Not Limited By Paperwork.

**KaushalAI is building the digital identity layer for Bharat's workforce.**

</div>
