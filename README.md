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

## 🎯 Problem Statement

Many skilled workers face challenges such as:

* Lack of professional resumes
* Limited access to verified certifications
* Language barriers in digital platforms
* Difficulty proving practical expertise
* Limited employer visibility
* Lack of a trusted digital identity

Traditional hiring methods often prioritize paperwork over practical competence.

**KaushalAI shifts the focus from qualifications to demonstrated skills.**

---

## ✨ Features

### 🤖 AI-Powered Skill Assessment

Powered by **Google Gemini 2.5 Flash**, KaushalAI conducts conversational and adaptive assessments tailored to vocational trades.

#### Capabilities

* Dynamic AI-driven questioning
* Scenario-based practical evaluations
* Skill-level analysis
* Trade-specific assessments
* Instant performance feedback
* Personalized recommendations

#### Supported Domains

* Electrical Work
* Plumbing
* Welding
* Carpentry
* Construction
* Technical Maintenance

---

### 🌐 Multilingual Experience

Language should never be a barrier to opportunity.

KaushalAI currently supports:

* 🇮🇳 Hindi
* 🇮🇳 Marathi
* 🇬🇧 English

Workers can learn, interact, and complete assessments in their preferred language.

---

### 📄 AI Resume Generator

Transforms worker profiles, certifications, and experience into professional resumes.

#### Features

* ATS-friendly formatting
* Markdown-based generation
* Professional layouts
* Easy export and sharing
* Skill-focused presentation

#### Resume Includes

* Personal Information
* Work Experience
* Skills
* Certifications
* Assessment Results
* Project Experience

---

### 🏆 QR-Based Certificate Verification

Workers receive secure digital certificates upon successful course or assessment completion.

#### Benefits

* Auto-generated PDF certificates
* Unique QR verification codes
* Employer authenticity checks
* Reduced certificate fraud
* Instant profile verification

#### Verification Flow

```text
Assessment Completed
        ↓
Certificate Generated
        ↓
QR Code Embedded
        ↓
Employer Verification
        ↓
Trusted Hiring
```

---

### 👷 Worker Dashboard

A centralized workspace designed for continuous career growth.

#### Features

* Learning Progress Tracking
* Assessment History
* Skill Analytics
* Skill Radar Charts
* Resume Management
* Certificate Library
* Job Application Tracking
* Profile Management

---

### 🏢 Employer Dashboard

A hiring platform focused on verified skills and trust.

#### Features

* Job Posting
* Candidate Discovery
* Verified Worker Profiles
* Application Management
* Skill-Based Filtering
* Assessment Performance Insights

---

### 💼 Job Marketplace

Connecting verified workers directly with employers.

#### Features

* Job Listings
* Skill-Based Matching
* Application Tracking
* Employer Verification
* Hiring Management

---

### 🚶 Walk Reward Integration

A unique wellness module promoting healthier lifestyles.

#### Benefits

* Activity Tracking
* Daily Movement Goals
* Reward-Based Engagement
* Health Awareness

Encouraging professional growth alongside physical well-being.

---

## 🏗️ System Architecture

```text
┌─────────────────────────┐
│     React Frontend      │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│    Express Backend      │
└──────────┬──────────────┘
           │
 ┌─────────┴─────────┐
 ▼                   ▼
MongoDB         Gemini API
Database         AI Engine
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* Tailwind CSS
* React Router
* React Markdown
* Lucide React
* i18next

### Backend

* Node.js
* Express.js
* JWT Authentication
* Cookie-Based Authentication
* REST APIs

### Database

* MongoDB
* Mongoose ODM

### AI & Automation

* Google Gemini 1.5 Flash
* Google Gemini 2.5 Flash

### Utilities

* jsPDF
* html2canvas
* QR Code Generation
* i18next

---

## 🎨 Design System

Built for outdoor visibility and maximum readability.

| Component        | Color     |
| ---------------- | --------- |
| Primary Navy     | `#1A56A0` |
| Accent Gold      | `#F4A223` |
| Deep Navy Text   | `#1A1A2E` |
| White Background | `#FFFFFF` |

### Design Principles

* Mobile-First
* High Contrast
* Accessibility Focused
* Rural-Friendly UX
* Lightweight Performance

---

## 🔒 Security Features

* JWT Authentication
* Secure Cookie Sessions
* Protected Routes
* Role-Based Access Control
* Input Validation
* Secure Certificate Verification
* API Authorization Middleware

---

## 📂 Project Structure

```bash
KaushalAI/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   └── assets/
│   │
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── package.json
│
├── README.md
└── .env
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/your-username/KaushalAI.git

cd KaushalAI
```

---

### Backend Setup

```bash
cd server

npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key
```

Run Backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd client

npm install
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

Run Frontend:

```bash
npm run dev
```

---

## 📊 Current Platform Capabilities

### ✅ Implemented

* User Authentication & Authorization
* AI Skill Assessments
* Multilingual Support
* Resume Generator
* QR Certificate Verification
* Worker Dashboard
* Employer Dashboard
* Job Portal
* Skill Analytics
* PDF Certificate Generation
* Walk Reward Integration
* Gemini-Powered Learning Experience

---

## 🔮 Future Roadmap

### Phase 2

* Voice-Based Assessments
* Speech-to-Text Evaluation
* AI Career Guidance Assistant
* Personalized Learning Paths
* Additional Indian Languages

### Phase 3

* Government Skill Development Integration
* National Digital Skill Passport
* Blockchain-Based Credential Verification
* Apprenticeship Marketplace
* Employer Skill Benchmarking

### Phase 4

* AI Job Matching Engine
* Workforce Demand Forecasting
* International Verification System
* Offline-First Mobile Application
* Smart Recommendation Ecosystem

---

## 📈 Impact

KaushalAI aims to provide:

* Trusted Digital Identity
* Verified Skill Recognition
* Professional Visibility
* Better Employment Opportunities
* Accessible Learning Infrastructure

for the workers who build and maintain India's future every day.

---

## 🤝 Contributing

Contributions, ideas, and feedback are welcome.

1. Fork the repository
2. Create your feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to the branch

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

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
