import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import { Languages, Menu, X, User, LogOut, ChevronDown, BookOpen, Briefcase, Award, FileText, Sun, Moon, Sparkles } from 'lucide-react';
import { cn } from '../utils/cn';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  console.log('Current User Data:', user);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileRef]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);



  const NavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname.startsWith(to) && to !== '/' || (to === '/' && location.pathname === '/');
    return (
      <Link
        to={to}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all duration-200",
          isActive 
            ? "bg-primary/10 text-primary dark:text-accent border-b-2 border-accent rounded-b-none" 
            : "text-gray-600 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white"
        )}
      >
        {Icon && <Icon size={18} className="shrink-0" />}
        <span>{children}</span>
      </Link>
    );
  };

  const MobileNavLink = ({ to, children, icon: Icon }) => {
    const isActive = location.pathname.startsWith(to) && to !== '/' || (to === '/' && location.pathname === '/');
    return (
      <Link
        to={to}
        onClick={() => setMobileMenuOpen(false)}
        className={cn(
          "flex items-center gap-2 px-4 py-3 text-base font-bold rounded-xl transition-all duration-200",
          isActive
            ? "bg-primary/10 text-primary dark:text-accent border-l-4 border-accent rounded-l-none"
            : "text-gray-700 dark:text-gray-300 hover:bg-primary/5 dark:hover:bg-white/10 hover:text-primary dark:hover:text-white"
        )}
      >
        {Icon && <Icon size={20} className="shrink-0" />}
        <span>{children}</span>
      </Link>
    );
  };

  const getWorkerLinks = () => (
    <>
      <NavLink to="/profile" icon={User}>{t('nav.profile') || 'Profile'}</NavLink>
      <NavLink to="/courses" icon={BookOpen}>{t('nav.courses') || 'Courses'}</NavLink>
      <NavLink to="/assessment" icon={Sparkles}>{t('nav.assessment') || 'Skill Assessment'}</NavLink>
      <NavLink to="/resume" icon={FileText}>{t('nav.resume') || 'Resume'}</NavLink>
      <NavLink to="/jobs" icon={Briefcase}>{t('nav.jobs') || 'Find Jobs'}</NavLink>
    </>
  );

  const getEmployerLinks = () => (
    <>
      <NavLink to="/employer/dashboard" icon={User}>{t('dashboard')}</NavLink>
      <NavLink to="/employer/tracker" icon={Briefcase}>Kanban</NavLink>
      <NavLink to="/jobs" icon={BookOpen}>Job Board</NavLink>
    </>
  );

  return (
    <nav className={cn(
      "sticky top-0 z-50 transition-all duration-300 w-full bg-white dark:bg-[#0F172A]",
      scrolled ? "shadow-md py-2 border-b border-primary/20 dark:border-slate-700" : "py-3 border-b border-transparent"
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0 group">
            <span className="text-2xl font-extrabold text-primary dark:text-blue-400 tracking-tight transition-transform group-hover:scale-105">
              Kaushal<span className="text-accent">AI</span>
            </span>
          </Link>

          {/* Desktop Links (Center) */}
          <div className="hidden md:flex items-center space-x-1 mx-8 justify-center flex-1">
            <NavLink to="/">Home</NavLink>
            {user && role === 'worker' && getWorkerLinks()}
            {user && role === 'employer' && getEmployerLinks()}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-primary/20 dark:border-slate-700 hover:border-gray-300 dark:hover:border-gray-600 bg-gray-50 dark:bg-gray-800 hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors shadow-sm"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} className="text-accent" /> : <Moon size={18} className="text-primary" />}
            </button>
            <LanguageSelector />

            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white border border-primary/20 dark:border-slate-700 rounded-full hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-400 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                    {(user?.name || user?.companyName || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold max-w-[100px] truncate">{user?.name || user?.companyName || 'User'}</span>
                  <ChevronDown size={14} className={cn("text-gray-500 transition-transform duration-200", profileOpen ? "rotate-180" : "")} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-primary/20 dark:border-slate-700 rounded-xl shadow-xl py-1 animate-slide-up transform origin-top-right">
                    <div className="px-4 py-3 border-b border-primary/20 dark:border-slate-700">
                      <p className="text-sm text-gray-900 font-semibold">{user?.name || user?.companyName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email || user?.phone}</p>
                    </div>
                    <Link to={role === 'worker' ? '/profile' : '/employer/dashboard'} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary/5 hover:text-primary transition-colors">
                      <User size={16} /> {t('nav.profile') || 'My Profile'}
                    </Link>
                    <button
                      onClick={logout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> {t('nav.logout') || 'Logout'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-5 py-2 text-sm font-bold text-gray-700 hover:text-primary transition-colors"
                >
                  {t('auth.login') || 'Login'}
                </Link>
                <Link
                  to="/register/worker"
                  className="px-5 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-blue-700 shadow-sm hover:shadow-md hover:-translate-y-px transition-all"
                >
                  {t('nav.get_started') || 'Sign Up Free'}
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <div className="scale-90 origin-right">
              <LanguageSelector />
            </div>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-primary hover:bg-primary/5 focus:outline-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-primary/20 dark:border-slate-700 animate-slide-up">
          <div className="px-4 pt-2 pb-6 space-y-1">
            <MobileNavLink to="/">Home</MobileNavLink>
            {user ? (
              <>
                {role === 'worker' && (
                  <>
                    <MobileNavLink to="/profile" icon={User}>{t('nav.profile') || 'Profile'}</MobileNavLink>
                    <MobileNavLink to="/courses" icon={BookOpen}>{t('nav.courses') || 'Courses'}</MobileNavLink>
                    <MobileNavLink to="/assessment" icon={Sparkles}>{t('nav.assessment') || 'Skill Assessment'}</MobileNavLink>
                    <MobileNavLink to="/resume" icon={FileText}>{t('nav.resume') || 'Resume'}</MobileNavLink>
                    <MobileNavLink to="/jobs" icon={Briefcase}>{t('nav.jobs') || 'Jobs'}</MobileNavLink>
                  </>
                )}
                {role === 'employer' && getEmployerLinks()}
                <div className="pt-4 mt-2 border-t border-primary/20 dark:border-slate-700">
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="flex items-center gap-3 w-full px-4 py-3 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20">
                    <LogOut size={20} /> {t('nav.logout') || 'Logout'}
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 dark:text-gray-300 font-bold text-center border border-primary/20 dark:border-slate-700 rounded-xl mb-3"
                >
                  {t('auth.login') || 'Log in'}
                </Link>
                <Link
                  to="/register/worker"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-primary text-white font-bold text-center rounded-xl shadow-md"
                >
                  {t('nav.get_started') || 'Get Started Free'}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
