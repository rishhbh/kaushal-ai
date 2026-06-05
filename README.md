# KaushalAI (कौशलएआई) 🚀
### "Empowering the Hands that Build Bharat."

**KaushalAI** is a mission-driven MERN stack platform designed to bring professional identity and trust to India's vocational workforce. From AI-powered skill assessments in local languages to high-quality resume generation, we are building the digital infrastructure for the informal sector.

---

## 🌟 Key Features

* **AI Skill Assessment:** Dynamic, conversational evaluations powered by **Gemini 2.5 Flash**. Workers can prove their expertise in trades like Electrical, Welding, and Plumbing without heavy theoretical exams.
* **Multilingual by Default:** Support for **Hindi, Marathi, and English**. We speak the language of the worker, ensuring zero barriers to entry in regions like Uttar Pradesh.
* **Pro Resume Engine:** Transforms worker experience into a clean, **Markdown-formatted resume**. Optimized for high contrast and professional readability.
* **Verifiable QR Certificates:** Automatically generated PDF certificates upon completion of AI-vetted courses. Employers can scan to verify a worker's profile instantly.
* **Employer & Worker Dashboards:** * **Workers:** Track learning progress, skill radar charts, and job applications.
    * **Employers:** Post jobs, view verified applicant profiles, and manage hiring.
* **Walk Reward Integration:** A unique fitness-fintech module that rewards physical activity, promoting health alongside professional growth.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS, Lucide Icons, React-Markdown |
| **Backend** | Node.js, Express.js, JWT Auth (Cookie-based) |
| **Database** | MongoDB (Mongoose ODM) |
| **AI Integration** | Google Gemini API (1.5 & 2.5 Flash) |
| **Utilities** | html2canvas, jsPDF, i18next |

---

## 🎨 Design System

To ensure usability in bright outdoor conditions (like on-site in Lucknow), we use a high-contrast professional palette:

* **Primary Navy:** `#1A56A0` — Trust and authority.
* **Accent Gold:** `#F4A223` — AI intelligence and premium status.
* **Base Text:** `#1A1A2E` — Deep Navy for maximum legibility on white backgrounds.

---

## ⚙️ Setup & Installation

### Backend
1. `cd server`
2. `npm install`
3. Configure `.env`:
   - `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`
4. `npm run dev`

### Frontend
1. `cd client`
2. `npm install`
3. Configure `.env`:
   - `VITE_API_URL=http://localhost:5000`
4. `npm run dev`

---

## 👨‍💻 Developed By
**Rishabh** — A Software Developer