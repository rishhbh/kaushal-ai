import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { MapPin, Briefcase, IndianRupee, Sparkles, Filter, FilterX, Building } from 'lucide-react';
import toast from 'react-hot-toast';

const JobBoard = () => {
  const { user } = useAuth();
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [fitLoading, setFitLoading] = useState(null);

  // Filters
  const [tradeFilter, setTradeFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setAllJobs(data.data);
        setJobs(data.data);
      } catch (err) {
        toast.error('Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    let filtered = allJobs;
    if (tradeFilter !== 'All') filtered = filtered.filter(j => j.trade === tradeFilter);
    if (levelFilter !== 'All') filtered = filtered.filter(j => j.level === levelFilter);
    setJobs(filtered);
  }, [tradeFilter, levelFilter, allJobs]);

  const trades = ['All', ...new Set(allJobs.map(c => c.trade))];
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const handleApply = async (jobId) => {
    setApplyingId(jobId);
    try {
      await api.post(`/jobs/${jobId}/apply`);
      toast.success('Application submitted successfully!');
      setJobs(jobs.map(j => j._id === jobId ? {...j, hasApplied: true} : j));
    } catch(e) {
      toast.error(e.response?.data?.message || 'Failed to apply');
    } finally {
      setApplyingId(null);
    }
  };

  const checkFit = async (jobId) => {
    setFitLoading(jobId);
    try {
      const { data } = await api.post(`/ai/job-fit`, { jobId });
      toast((t) => (
        <div className="flex flex-col gap-2">
           <div className="flex justify-between items-center pb-2 border-b">
             <span className="font-bold">AI Match Analysis</span>
             <span className={`px-2 py-0.5 rounded text-xs font-bold ${data.data.matchScore > 75 ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
               {data.data.matchScore}% Match
             </span>
           </div>
           <div><b>Strengths:</b> <span className="text-green-600 text-sm">{data.data.strengths.join(', ')}</span></div>
           <div><b>Gaps:</b> <span className="text-red-500 text-sm">{data.data.gaps.join(', ')}</span></div>
           <button onClick={() => toast.dismiss(t.id)} className="mt-2 bg-gray-100 py-1 rounded w-full text-xs font-bold">Dismiss</button>
        </div>
      ), { duration: 8000 });
    } catch(e) {
      toast.error('Failed to analyze fit. Please try again later.');
    } finally {
      setFitLoading(null);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="w-48 h-10 bg-gray-200 rounded mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[1,2,3,4].map(i => <div key={i} className="h-64 bg-gray-100 rounded-3xl"></div>)}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2">Job Board</h1>
          <p className="text-gray-500 font-medium">Discover opportunities tailored to your trade & level</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl shadow-sm border border-primary/20 dark:border-slate-700">
          <div className="flex items-center gap-2 pl-2">
            <Filter size={18} className="text-gray-400" />
            <select value={tradeFilter} onChange={e => setTradeFilter(e.target.value)} className="bg-gray-50 border-none rounded-lg text-sm font-semibold focus:ring-0 cursor-pointer">
              {trades.map(t => <option key={t} value={t}>{t === 'All' ? 'All Trades' : t}</option>)}
            </select>
          </div>
          <div className="w-px h-6 bg-gray-200"></div>
          <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)} className="bg-gray-50 border-none rounded-lg text-sm font-semibold focus:ring-0 cursor-pointer">
            {levels.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l}</option>)}
          </select>
          {(tradeFilter !== 'All' || levelFilter !== 'All') && (
            <button onClick={() => { setTradeFilter('All'); setLevelFilter('All'); }} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Clear Filters">
              <FilterX size={18} />
            </button>
          )}
        </div>
      </div>

      {jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-primary/20 dark:border-slate-700 text-center shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6"><Briefcase size={40} className="text-gray-300" /></div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No active jobs found</h3>
          <p className="text-gray-500 max-w-sm mb-6 font-medium">Try adjusting your filters or wait for employers to post new opportunities.</p>
          <button onClick={() => { setTradeFilter('All'); setLevelFilter('All'); }} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition">Reset Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map(job => {
             const userTradeMatch = user?.trade === job.trade;
             return (
               <div key={job._id} className="bg-white p-8 rounded-3xl shadow-sm border border-primary/20 dark:border-slate-700 flex flex-col hover-lift group relative overflow-hidden">
                 {/* Decorative background circle */}
                 <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-100 transition-colors pointer-events-none"></div>

                 <div className="flex justify-between items-start mb-6 relative z-10">
                    <div>
                       <h3 className="text-2xl font-bold text-gray-900 group-hover:text-primary transition-colors">{job.title}</h3>
                       <p className="text-gray-500 font-semibold flex items-center gap-1.5 mt-1 border border-primary/20 dark:border-slate-700 px-3 py-1 rounded-full text-xs w-max bg-gray-50">
                          <Building size={14} className="text-gray-400" /> {job.employerId?.companyName || 'KaushalAI Partner'}
                       </p>
                    </div>
                    {userTradeMatch && (
                      <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-[11px] font-extrabold border border-green-200 shrink-0 uppercase tracking-widest leading-none">
                        Top Match
                      </span>
                    )}
                 </div>
                 
                 <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-600 font-bold bg-gray-50 p-4 rounded-2xl border border-primary/20 dark:border-slate-700">
                    <div className="flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> {job.location}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full self-center"></div>
                    <div className="flex items-center gap-2"><Briefcase size={16} className="text-gray-400" /> {job.level}</div>
                    <div className="w-1 h-1 bg-gray-300 rounded-full self-center"></div>
                    <div className="flex items-center gap-1.5 text-green-700 bg-green-50 px-2 py-0.5 rounded-md"><IndianRupee size={16} /> {job.salaryMin} - {job.salaryMax}</div>
                 </div>

                 <p className="text-sm text-gray-500 mb-8 flex-1 line-clamp-3 whitespace-pre-wrap leading-relaxed relative z-10">{job.description}</p>
                 
                 {job.requiredCertifications && job.requiredCertifications.length > 0 && job.requiredCertifications[0] !== "" && (
                    <div className="mb-6 relative z-10">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-primary/20 dark:border-slate-700 pb-1">Requires Credentials</p>
                      <div className="flex gap-2 flex-wrap">
                        {job.requiredCertifications.map((c, i) => (
                           <span key={i} className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-md text-xs font-bold border border-primary/20 dark:border-slate-700">{c}</span>
                        ))}
                      </div>
                    </div>
                 )}

                 <div className="flex gap-4 mt-auto relative z-10">
                    <button onClick={() => checkFit(job._id)} disabled={fitLoading === job._id} className="flex-1 bg-amber-50 text-amber-700 py-3 rounded-xl font-extrabold hover:bg-amber-100 hover:shadow-md transition-all border border-amber-200 flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 hover:-translate-y-px">
                      <Sparkles size={18} /> {fitLoading === job._id ? 'Analyzing...' : 'Analyze Fit'}
                    </button>
                    <button 
                      onClick={() => handleApply(job._id)} 
                      disabled={job.hasApplied || applyingId === job._id}
                      className="flex-1 bg-primary text-white py-3 rounded-xl font-extrabold hover:bg-blue-700 transition-all hover:-translate-y-px hover:shadow-md hover:shadow-blue-900/20 disabled:opacity-50 disabled:bg-green-600 disabled:shadow-none disabled:translate-y-0"
                    >
                      {job.hasApplied ? 'Applied ✓' : (applyingId === job._id ? 'Applying...' : 'Apply Now')}
                    </button>
                 </div>
               </div>
             );
          })}
        </div>
      )}
    </div>
  );
};
export default JobBoard;
