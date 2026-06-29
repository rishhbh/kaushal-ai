import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Building2, Briefcase, FileText, MapPin, Map, User, Mail, Lock, Eye, EyeOff, Loader2, ArrowRight, CheckCircle2, ChevronLeft } from 'lucide-react';
import toast from 'react-hot-toast';

const EmployerRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    companyName: '', gst: '', industry: 'Construction', companySize: '', city: '', state: '', contactName: '', email: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setRole, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    
    const handle401 = () => {
      setUser(null);
      setRole(null);
      localStorage.removeItem('token');
    };
    window.addEventListener('auth:401', handle401);
    return () => window.removeEventListener('auth:401', handle401);
  }, [navigate, setUser, setRole]);

  const handleNext = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.companyName || !formData.gst || !formData.industry) {
        toast.error('Please fill company details');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.companySize || !formData.state || !formData.city) {
        toast.error('Please fill location sizing');
        return;
      }
      setStep(3);
    }
  };

  const handleBack = () => {
    setStep(s => s - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/register/employer', formData);
      setUser(data.user);
      setRole('employer');
      toast.success('Company account created successfully!');
      navigate('/employer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-background dark:bg-[#0F172A] transition-colors duration-300">
      
      {/* Left Panel - Auth Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 relative z-10 overflow-y-auto">
        <div className="w-full max-w-md animate-slide-up py-10">
          <Link to="/" className="inline-flex items-center text-primary dark:text-blue-400 font-extrabold text-2xl mb-8 hover:opacity-80 transition-opacity">
            Kaushal<span className="text-accent">AI</span>
          </Link>
          
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Partner with us 🏢</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 font-medium text-lg">Create your corporate employer account.</p>
          
          <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
            
            {/* Step Indicators */}
            <div className="flex gap-2 mb-8 relative z-10">
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
              <div className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 3 ? 'bg-accent' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            </div>

            <form onSubmit={step === 3 ? handleSubmit : handleNext} className="relative z-10">
              
              {/* Step 1: Company Info */}
              {step === 1 && (<div className="space-y-4 animate-fade-in relative z-10">
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" placeholder="E.g. BuildCorp India" name="companyName" autoFocus value={formData.companyName} onChange={e => setFormData({...formData, companyName: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">GST Number</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium uppercase" placeholder="22AAAAA0000A1Z5" name="gst" value={formData.gst} onChange={e => setFormData({...formData, gst: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <select required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium appearance-none" name="industry" value={formData.industry} onChange={e => setFormData({...formData, industry: e.target.value})}>
                      <option value="Construction">Construction</option>
                      <option value="Home Services">Home Services</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Logistics">Logistics</option>
                    </select>
                  </div>
                </div>

                <button type="button" onClick={handleNext} className="w-full flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold text-lg shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all mt-6">
                  Continue Form <ArrowRight size={18}/>
                </button>
              </div>)}

              {/* Step 2: Location & Size */}
              {step === 2 && (<div className="space-y-4 animate-fade-in relative z-10">
                
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Company Size (Employees)</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <select required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium appearance-none" name="companySize" autoFocus value={formData.companySize} onChange={e => setFormData({...formData, companySize: e.target.value})}>
                      <option value="" disabled>Select workforce size</option>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="200+">200+ Employees</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative group">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">State</label>
                    <div className="relative">
                      <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <input type="text" required className="w-full pl-9 pr-3 py-2.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  outline-none dark:text-white text-sm font-medium" placeholder="Maharashtra" name="state" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                    </div>
                  </div>
                  <div className="relative group">
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5 uppercase tracking-wide">City</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                      <input type="text" required className="w-full pl-9 pr-3 py-2.5  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  outline-none dark:text-white text-sm font-medium" placeholder="Mumbai" name="city" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={handleBack} className="flex-1 flex justify-center items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeft size={18}/> Back
                  </button>
                  <button type="button" onClick={handleNext} className="flex-[2] flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all">
                    Next Step <ArrowRight size={18}/>
                  </button>
                </div>
              </div>)}

              {/* Step 3: Account Details */}
              {step === 3 && (<div className="space-y-4 animate-fade-in relative z-10">
                
                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Contact Person Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type="text" required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" placeholder="HR Manager Name" name="contactName" autoFocus value={formData.contactName} onChange={e => setFormData({...formData, contactName: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Work Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type="email" required className="w-full pl-11 pr-4 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" placeholder="hr@company.com" name="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                    <input type={showPassword ? "text" : "password"} required className="w-full pl-11 pr-11 py-3  text-[#1A1A2E] border border-primary/20 dark:border-slate-700 rounded-xl  dark:text-white outline-none transition-all font-medium" placeholder="••••••••" name="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={handleBack} className="flex-1 flex justify-center items-center gap-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3.5 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <ChevronLeft size={18}/> Back
                  </button>
                  <button type="submit" disabled={isLoading} className="flex-[2] flex justify-center items-center gap-2 bg-primary text-white py-3.5 rounded-xl font-extrabold shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20}/> Complete Setup</>}
                  </button>
                </div>
              </div>)}

            </form>
          </div>
          
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400 font-medium pb-10">
            Already have an account?{' '}
            <Link to="/login" className="text-primary dark:text-blue-400 font-bold hover:underline">
              Log in here
            </Link>
          </p>
        </div>
      </div>

      {/* Right Panel - Visual Illustration */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-white dark:bg-[#080d1a] items-center justify-center p-12 transition-colors">
        <div className="absolute inset-0 bg-gradient-to-bl from-accent/20 to-primary/5 z-0"></div>
        {/* Abstract animated shapes */}
        <div className="absolute top-1/3 left-10 w-80 h-80 bg-accent/30 dark:bg-accent/10 opacity-60 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-primary/20 dark:bg-blue-600/20 opacity-60 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen animate-pulse" style={{animationDelay: '1s'}}></div>
        
        <div className="relative z-10 text-center max-w-lg mb-20 animate-slide-up">
          <div className="bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-primary/20 dark:border-slate-700 dark:border-primary/20/10 p-8 rounded-3xl shadow-2xl dark:shadow-black/50">
            <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-2xl w-max mx-auto mb-6 animate-bounce">
              <Briefcase size={40} className="text-accent" />
            </div>
            <h2 className="text-4xl font-extrabold mb-4 leading-tight text-gray-900 dark:text-white">Hire Verified Talent at Scale.</h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg font-medium leading-relaxed">
              Join KaushalAI's partner network to access AI-assessed professionals. Generate job descriptions instantly and manage your hiring pipeline with our Kanban tracker.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerRegister;
