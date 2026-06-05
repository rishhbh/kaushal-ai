import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Lock, User, MapPin, Briefcase, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, Sparkles, BookOpen } from 'lucide-react';
import { cn } from '../utils/cn';
import toast from 'react-hot-toast';

const languages = [
  { code: 'hi', label: 'हिंदी', flag: '🇮🇳' },
  { code: 'en', label: 'English', flag: '🌐' },
  { code: 'mr', label: 'मराठी', flag: '🇮🇳' },
];

const WorkerRegister = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({ name: '', phone: '', password: '', district: '', state: '', trade: '', experience: '', language: 'hi' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const { setUser, setRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    
    const handle401 = () => {
      setUser?.(null);
      setRole?.(null);
      localStorage.removeItem('token');
      navigate('/');
    };
    window.addEventListener('auth:401', handle401);
    return () => window.removeEventListener('auth:401', handle401);
  }, [navigate, setUser, setRole]);

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.name || !formData.phone || !formData.password) {
        toast.error('Please fill all basic details');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.district || !formData.state || !formData.trade || !formData.experience) {
        toast.error('Please fill all trade details');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        experience: parseInt(formData.experience) || 0
      };
      
      const { data } = await api.post('/auth/register/worker', payload);
      setUser(data.user);
      setRole('worker');
      
      i18n.changeLanguage(formData.language);
      localStorage.setItem('kaushal_lang', formData.language);
      toast.success(t('toasts.login_success') || 'Account created successfully!');
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.patch('/auth/skip-assessment');
      setUser(data.user);
      navigate('/courses');
    } catch(err) {
      toast.error('Error skipping assessment');
    } finally {
      setIsLoading(false);
    }
  };

  if (showModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-[#0F172A] p-6 relative z-10 transition-colors duration-300">
        <div className="absolute inset-0 bg-primary/5 dark:bg-white/5 backdrop-blur-3xl z-0"></div>
        <div className="glass-card max-w-lg w-full rounded-3xl p-10 relative z-10 animate-slide-up shadow-2xl border border-primary/20 dark:border-slate-700">
          <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-full w-max mx-auto mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-4">Registration Complete!</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 font-medium text-lg leading-relaxed mb-8">
            Workers who complete their AI assessment get <span className="text-primary font-bold">3x more interviews</span>. Would you like to evaluate your formal skills now?
          </p>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/assessment')} 
              className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-xl font-extrabold text-lg shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all hover:-translate-y-1"
            >
              <Sparkles size={24} /> Start AI Assessment (5 mins)
            </button>
            <button 
              onClick={handleSkip} disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold text-base hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><BookOpen size={20} /> Skip for now, show me courses</>}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background dark:bg-[#0F172A] transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 overflow-y-auto w-full">
        <div className="w-full max-w-md animate-slide-up py-10">
          <Link to="/" className="inline-flex items-center text-primary dark:text-blue-400 font-extrabold text-2xl mb-8 hover:opacity-80 transition-opacity">
            Kaushal<span className="text-accent">AI</span>
          </Link>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">{t('auth.register_worker')}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium text-lg">Create a worker profile to get certified.</p>
          
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            <div className="flex gap-2 mb-8 relative z-10">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>

            <form onSubmit={step < 3 ? handleNext : handleSubmit} className="relative z-10">
              
              {step === 1 && (<div className="space-y-4 animate-fade-in relative z-10">
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.name')}</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" name="name" autoFocus required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type={showPassword ? "text" : "password"} required className="w-full pl-11 pr-11 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="button" onClick={handleNext} className="w-full flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold text-lg shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mt-6">
                  {t('auth.next')} <ArrowRight size={18}/>
                </button>
              </div>)}

              {step === 2 && (<div className="space-y-4 animate-fade-in relative z-10">
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">{t('auth.state')}</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <input type="text" required className="w-full pl-9 pr-3 py-2.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  outline-none dark:text-white text-sm font-medium" name="state" autoFocus value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">{t('auth.district')}</label>
                    <div className="relative">
                      <input type="text" required className="w-full px-4 py-2.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  outline-none dark:text-white text-sm font-medium" name="district" value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.trade')}</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <select required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  outline-none dark:text-white font-medium appearance-none" name="trade" value={formData.trade} onChange={e => setFormData({...formData, trade: e.target.value})}>
                      <option value="" disabled>Select</option>
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Mason">Mason</option>
                      <option value="Painter">Painter</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">{t('auth.experience')}</label>
                  <input type="number" required min="0" className="w-full px-4 py-2.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  outline-none dark:text-white text-sm font-medium" name="experience" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})} />
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Back
                  </button>
                  <button type="button" onClick={handleNext} className="flex-[2] flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                    {t('auth.next')} <ArrowRight size={18}/>
                  </button>
                </div>
              </div>)}

              {step === 3 && (<div className="space-y-4 animate-fade-in relative z-10">
                <h2 className="text-2xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
                  {t('auth.language_pref') || 'आप किस भाषा में सीखना चाहते हैं?'}
                </h2>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {languages.map(lang => (
                    <button 
                      key={lang.code} type="button" 
                      onClick={() => setFormData({...formData, language: lang.code})}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-all shadow-sm flex flex-col items-center justify-center gap-2", 
                        formData.language === lang.code 
                          ? "border-primary bg-blue-50 dark:bg-blue-900/30 ring-2 ring-primary/20 scale-105" 
                          : "border-primary/20 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800"
                      )}
                    >
                      <div className="text-3xl">{lang.flag}</div>
                      <div className="font-extrabold text-gray-900 dark:text-white text-lg font-sans">{lang.label}</div>
                    </button>
                  ))}
                </div>
                
                <p className="text-sm font-medium text-gray-500 text-center mb-6">आप बाद में भाषा बदल सकते हैं (You can change language later)</p>
                
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setStep(2)} className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    Back
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-[2] flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20}/> {t('auth.submit') || 'Submit'}</>}
                  </button>
                </div>
              </div>)}

            </form>
          </div>
          
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400 font-medium pb-10">
            {t('auth.already_account')} <Link to="/login" className="text-primary dark:text-blue-400 font-bold hover:underline">Log in</Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#1A56A0] via-[#103D75] to-[#0A294F] z-0"></div>
        <div className="absolute top-1/3 right-10 w-80 h-80 bg-green-400 opacity-20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 -left-10 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/connected.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10 text-center text-white max-w-lg mb-20 animate-slide-up">
          <div className="bg-white/10 backdrop-blur-md border border-primary/20/20 p-8 rounded-3xl shadow-2xl">
            <div className="bg-white p-3 rounded-2xl w-max mx-auto shadow-sm mb-6 animate-bounce">
              <CheckCircle2 size={40} className="text-green-500" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Get Certified instantly.</h2>
            <p className="text-blue-100/80 text-lg font-medium leading-relaxed">
              Register yourself to undergo our completely automated AI appraisal system in your language. We'll map your current skills to formal grades, absolutely free.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerRegister;
