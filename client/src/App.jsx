import { Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import WorkerRegister from './pages/WorkerRegister';
import EmployerRegister from './pages/EmployerRegister';
import AssessmentChat from './pages/AssessmentChat';
import SkillProfile from './pages/SkillProfile';
import CourseCatalog from './pages/CourseCatalog';
import CoursePage from './pages/CoursePage';
import CertificatePage from './pages/CertificatePage';
import ResumeBuilder from './pages/ResumeBuilder';
import EmployerDashboard from './pages/EmployerDashboard';
import PostJob from './pages/PostJob';
import ApplicantTracker from './pages/ApplicantTracker';
import JobBoard from './pages/JobBoard';
import { useTranslation } from 'react-i18next';
import { cn } from './utils/cn';

function App() {
  const { i18n } = useTranslation();
  
  const currentLang = i18n.language || 'hi';
  const fontClass = {
    hi: 'font-devanagari',
    mr: 'font-devanagari',
    bn: 'font-bengali',
    ta: 'font-tamil',
    te: 'font-telugu',
    pa: 'font-gurmukhi',
    en: 'font-inter'
  }[currentLang] || 'font-sans';

  return (
    <div className={cn("min-h-screen bg-background dark:bg-[#0F172A] text-gray-900 dark:text-gray-100 flex flex-col transition-colors duration-300", fontClass)}>
      <Toaster position="top-center" toastOptions={{
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '12px',
          padding: '12px 24px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        },
        success: { iconTheme: { primary: '#1A7A4A', secondary: '#fff' } }
      }} />
      <Navbar />
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/worker" element={<WorkerRegister />} />
          <Route path="/register/employer" element={<EmployerRegister />} />
          <Route path="/assessment" element={<AssessmentChat />} />
          <Route path="/profile" element={<SkillProfile />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:id" element={<CoursePage />} />
          <Route path="/certificate/:certUUID" element={<CertificatePage />} />
          <Route path="/resume" element={<ResumeBuilder />} />
          <Route path="/jobs" element={<JobBoard />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/employer/post-job" element={<PostJob />} />
          <Route path="/employer/tracker" element={<ApplicantTracker />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
