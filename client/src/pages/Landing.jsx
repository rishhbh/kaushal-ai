import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Briefcase, UserPlus, BookOpen, Award, MessageSquare, ArrowRight, ShieldCheck, Zap, Sparkles, Building2 } from 'lucide-react';
import { cn } from '../utils/cn';

const Landing = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-[#0F172A] scroll-smooth transition-colors duration-300">
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-0 inset-x-0 h-full bg-gradient-to-b from-blue-50/80 dark:from-primary/10 to-white dark:to-[#0F172A] -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[800px] h-[800px] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-yellow-100/40 dark:bg-yellow-900/10 rounded-full blur-3xl opacity-60 pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 sm:px-6 lg:px-8 text-center animate-fade-in relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-gray-700 text-blue-800 dark:text-blue-300 text-sm font-bold mx-auto mb-8 shadow-sm">
            <Sparkles size={16} className="text-accent" /> Powered by Google Gemini AI
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight leading-tight max-w-5xl mx-auto">
            {t('landing.hero_prefix') || 'From Skill Gap to'} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 dark:from-blue-400 dark:to-blue-200 relative inline-block">
              {t('landing.hero_highlight') || 'Dream Job'}
              <svg className="absolute w-full h-4 -bottom-2 left-0 text-accent opacity-80" viewBox="0 0 200 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.00018 7.23431C43.1491 2.37346 114.286 -2.4842 198.001 6.55106" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('landing.subtitle') || "India's first AI-powered vernacular skill platform for 110M+ informal workers. Appraise, Learn, Certify, and Work."}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
            <Link to="/register/worker" className="group flex items-center justify-center gap-3 bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 hover:-translate-y-1">
              <UserPlus size={22} />
              {t('lookingForWork')}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/register/employer" className="group flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border-2 border-primary/20 dark:border-slate-700 text-gray-800 dark:text-white px-8 py-4 rounded-xl text-lg font-bold hover:border-accent hover:bg-amber-50 dark:hover:bg-gray-700 transition-all shadow-sm hover:-translate-y-1 hover:shadow-md">
              <Briefcase size={22} className="text-accent" />
              {t('hiring')}
            </Link>
          </div>
        </div>

        <div className="max-w-5xl mx-auto mt-20 px-4 relative z-10 animate-slide-up">
           <div className="rounded-2xl bg-white/50 dark:bg-[#1E293B]/50 backdrop-blur border border-primary/20 dark:border-gray-700 p-2 shadow-2xl">
              <div className="rounded-xl overflow-hidden bg-gray-50 dark:bg-[#0F172A] border border-primary/20 dark:border-slate-700 shadow-inner flex flex-col md:flex-row">
                 <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-primary/20 dark:border-slate-700 ">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b dark:border-gray-700">
                       <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"><Sparkles size={20}/></div>
                       <div>
                         <p className="font-bold text-gray-900 dark:text-white">KaushalAI Assessment</p>
                         <p className="text-xs text-green-600 dark:text-green-400 font-medium">Online</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 p-3 rounded-2xl rounded-tl-none text-sm max-w-[85%]">
                         Namaste! I'll ask you 5 questions to verify your skills. Ready?
                       </div>
                       <div className="bg-primary text-white p-3 rounded-2xl rounded-tr-none text-sm max-w-[85%] ml-auto">
                         Yes, let's start with safety wiring.
                       </div>
                    </div>
                 </div>
                 <div className="flex-1 p-6 bg-gray-50 dark:bg-[#0F172A] flex flex-col justify-center">
                    <div className="focus-within:bg-white  p-4 rounded-xl shadow-sm border border-primary/20 dark:border-slate-700 mb-4 flex items-center gap-4">
                       <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center"><Award size={24}/></div>
                       <div>
                         <p className="text-xs text-gray-500 font-bold uppercase">Level Verified</p>
                         <p className="font-bold text-lg text-gray-900 dark:text-white">Advanced Electrician</p>
                       </div>
                    </div>
                    <div className=" p-4 rounded-xl shadow-sm border border-primary/20 dark:border-slate-700 flex items-center gap-4">
                       <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500 rounded-lg flex items-center justify-center"><Briefcase size={24}/></div>
                       <div>
                         <p className="text-xs text-gray-500 font-bold uppercase">AI Match 95%</p>
                         <p className="font-bold text-gray-900 dark:text-white">Site Supervisor at L&T</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      <section className="border-y border-primary/20 dark:border-slate-700 bg-white dark:bg-[#0F172A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-800 text-center">
          <div className="p-4"><h3 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-blue-400 mb-2">63M+</h3><p className="text-sm font-bold text-gray-500 uppercase tracking-widest">MSMEs</p></div>
          <div className="p-4"><h3 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-blue-400 mb-2">110M+</h3><p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{t('landing.nav_workers') || 'Workers'}</p></div>
          <div className="p-4"><h3 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-blue-400 mb-2">3%</h3><p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Formally Trained</p></div>
          <div className="p-4"><h3 className="text-4xl lg:text-5xl font-extrabold text-primary dark:text-blue-400 mb-2">5+</h3><p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Key Trades</p></div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-[#111827] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-500 font-bold text-xs uppercase tracking-widest rounded-full mb-4">The Process</div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-16">{t('landing.how_it_works') || 'Your path to formal employment'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-blue-200 via-primary to-green-200 opacity-50 dark:opacity-20 -translate-y-1/2 rounded-full z-0"></div>
            
            {[
              { icon: MessageSquare, bg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400", title: "1. AI Assessment", desc: "Chat in Hindi/English to verify your trade skill level instantly." },
              { icon: BookOpen, bg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500", title: "2. Learn & Upskill", desc: "Take bite-sized modular courses recommended by AI." },
              { icon: Award, bg: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400", title: "3. Get Certified", desc: "Earn verifiable digital certificates to build trust." },
              { icon: Briefcase, bg: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400", title: "4. Get Hired", desc: "Apply for jobs with AI match-making in your local area." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center group">
                <div className={cn("w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm border-4 border-primary/20 dark:border-[#1F2937] transition-transform duration-300 group-hover:-translate-y-2 group-hover:shadow-lg", step.bg)}>
                  <step.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-6">Ready to bridge the gap?</h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">Join thousands of workers getting certified and hundreds of employers hiring verified talent.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
             <Link to="/register/worker" className="bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-blue-600 transition shadow-lg">{t('auth.register_worker') || 'Start as Worker'}</Link>
             <Link to="/register/employer" className="bg-white text-gray-900 px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary/5 transition shadow-lg">{t('auth.register_employer') || 'Start Hiring'}</Link>
          </div>
        </div>
      </section>
      
      <footer className="bg-gray-950 text-gray-400 py-12 text-center border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 mb-4">
           <span className="text-xl font-extrabold text-gray-300">Kaushal<span className="text-accent">AI</span></span>
        </div>
        <p className="text-sm font-medium">© 2026 KaushalAI. Empowering India's Workforce.</p>
      </footer>
    </div>
  );
};

export default Landing;
