import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Star, Sparkles, Filter, FilterX, BookX } from 'lucide-react';

const CourseCatalog = () => {
  const { user } = useAuth();
  const [allCourses, setAllCourses] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [tradeFilter, setTradeFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get('/courses');
        setAllCourses(data.data);
        setCourses(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    let filtered = allCourses;
    if (tradeFilter !== 'All') {
      filtered = filtered.filter(c => c.trade === tradeFilter);
    }
    if (levelFilter !== 'All') {
      filtered = filtered.filter(c => c.level === levelFilter);
    }
    setCourses(filtered);
  }, [tradeFilter, levelFilter, allCourses]);

  const trades = ['All', ...new Set(allCourses.map(c => c.trade))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Course Catalog</h1>
          <p className="text-gray-500 font-medium">Pick up new skills or master existing ones</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-primary/20 dark:border-slate-700">
          <div className="flex items-center gap-2 pl-2">
            <Filter size={18} className="text-gray-400" />
            <select 
              value={tradeFilter} onChange={e => setTradeFilter(e.target.value)}
              className="bg-gray-50 border-none rounded-lg text-sm font-semibold focus:ring-0 cursor-pointer"
            >
              {trades.map(t => <option key={t} value={t}>{t === 'All' ? 'All Trades' : t}</option>)}
            </select>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <select 
            value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
            className="bg-gray-50 border-none rounded-lg text-sm font-semibold focus:ring-0 cursor-pointer"
          >
            {levels.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
          </select>
          {(tradeFilter !== 'All' || levelFilter !== 'All') && (
            <button onClick={() => { setTradeFilter('All'); setLevelFilter('All'); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Clear Filters">
              <FilterX size={18} />
            </button>
          )}
        </div>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-primary/20 dark:border-slate-700 border-dashed text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4"><BookX size={40} className="text-gray-300" /></div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No courses found</h3>
          <p className="text-gray-500 max-w-sm mb-6">Try adjusting your filters or check back later for new content.</p>
          <button onClick={() => { setTradeFilter('All'); setLevelFilter('All'); }} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">Clear All Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => {
            const isRecommended = user?.skillLevel && course.level.toLowerCase() === user?.skillLevel.toLowerCase() && course.trade === user?.trade;
            const isEnrolled = user?.enrolledCourses?.includes(course._id);
            
            return (
              <div key={course._id} className="bg-white rounded-2xl shadow-sm border border-primary/20 dark:border-slate-700 hover-lift flex flex-col overflow-hidden group">
                <div className="h-4 w-full bg-gradient-to-r from-primary to-blue-400"></div>
                <div className="p-6 flex flex-col flex-1 relative">
                  <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100 tracking-wider">
                      {course.trade}
                    </span>
                    {isRecommended && (
                      <span className="flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 shadow-sm animate-pulse flex-shrink-0">
                        <Sparkles size={12} fill="currentColor" /> AI Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{course.title}</h3>
                  <p className="text-gray-500 text-sm mb-6 flex-1 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm font-semibold text-gray-600 mb-6 bg-gray-50 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5"><BookOpen size={16} className="text-primary" /> {course.level}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                    <div className="flex items-center gap-1.5"><Clock size={16} className="text-accent" /> {course.durationHrs} Hrs</div>
                  </div>

                  <Link to={`/courses/${course._id}`} className={`w-full text-center py-3 rounded-xl font-bold transition-all shadow-sm ${isEnrolled ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100" : "bg-primary text-white hover:bg-blue-700"}`}>
                    {isEnrolled ? 'Continue Learning' : 'Start Course'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CourseCatalog;
