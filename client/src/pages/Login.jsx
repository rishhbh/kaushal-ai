import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Phone, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, LogIn } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const { t } = useTranslation();
  const [role, setRole] = useState('worker');
  const [formData, setFormData] = useState({ phone: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, setUser, setRole: setAuthRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    
    const handle401 = () => {
      setUser(null);
      setAuthRole?.(null);
      localStorage.removeItem('token');
    };
    window.addEventListener('auth:401', handle401);
    return () => window.removeEventListener('auth:401', handle401);
  }, [navigate, setUser, setAuthRole]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login({ ...formData, role });
      toast.success(t('toasts.login_success') || 'Successfully logged in!');
      navigate(role === 'worker' ? '/profile' : '/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background dark:bg-[#0F172A] transition-colors duration-300">
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 w-full overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up">
          <Link to="/" className="inline-flex items-center text-primary dark:text-blue-400 font-extrabold text-2xl mb-10 hover:opacity-80 transition-opacity">
            Kaushal<span className="text-accent">AI</span>
          </Link>
          
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{t('auth.login') || 'Welcome back 👋'}</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-10 font-medium text-lg">{t('auth.login_sub') || 'Sign in to continue your journey.'}</p>
          
          <div className="glass-card rounded-2xl p-8 shadow-sm">
            <div className="flex bg-gray-100 dark:bg-[#0F172A] p-1.5 rounded-xl mb-8">
              <button 
                type="button"
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${role === 'worker' ? 'bg-white dark:bg-[#1F2937] text-primary dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                onClick={() => setRole('worker')}
              >
                Worker
              </button>
              <button 
                type="button"
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all duration-300 ${role === 'employer' ? 'bg-white dark:bg-[#1F2937] text-primary dark:text-blue-400 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
                onClick={() => setRole('employer')}
              >
                Employer
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {role === 'worker' ? (
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.phone')}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="text" required 
                      className="w-full pl-12 pr-4 py-3.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium"
                      placeholder="Enter 10-digit number"
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              ) : (
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">{t('auth.email')}</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                      type="email" required 
                      className="w-full pl-12 pr-4 py-3.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium"
                      placeholder="company@email.com"
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>
              )}

              <div className="relative group">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300">{t('auth.password')}</label>
                  <a href="#" className="text-xs font-bold text-primary dark:text-blue-400 hover:underline">{t('auth.forgot') || 'Forgot?'}</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"} required 
                    autoComplete="current-password"
                    className="w-full pl-12 pr-12 py-3.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium"
                    placeholder="••••••••"
                    onChange={e => setFormData({...formData, password: e.target.value})}
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold text-lg shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-6"
              >
                {isLoading ? <Loader2 className="animate-spin" size={24} /> : <><LogIn size={20}/> {t('auth.login') || 'Sign In'}</>}
              </button>
            </form>
          </div>
          
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400 font-medium">
            {t('auth.no_account')} {' '}
            <Link to={`/register/${role}`} className="text-primary dark:text-blue-400 font-bold hover:underline inline-flex items-center gap-1">
              {role === 'worker' ? t('auth.register_worker') : t('auth.register_employer')} <ArrowRight size={16} />
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-primary items-center justify-center p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A56A0] to-[#0A294F] z-0"></div>
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-400 opacity-20 rounded-full blur-3xl mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
        
        <div className="relative z-10 text-center text-white max-w-lg mb-20 animate-fade-in">
          <div className="bg-white/10 backdrop-blur-md border border-primary/20/20 p-8 rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500">
            <h2 className="text-4xl font-extrabold mb-4 leading-tight">Elevate Your Career Trajectory</h2>
            <p className="text-blue-100/80 text-lg font-medium leading-relaxed">
              Log in to appraise your skills with Gemini AI, unlock premium trade courses, and instantly connect with verified employers scaling their informal workforce.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
