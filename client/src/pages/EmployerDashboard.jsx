import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Briefcase, Users, FilePlus, ChevronRight } from 'lucide-react';

const EmployerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await api.get('/analytics/employer');
        setStats(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const chartData = [
    { name: 'W1', apps: 10 },
    { name: 'W2', apps: 25 },
    { name: 'W3', apps: 18 },
    { name: 'W4', apps: 40 }
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse text-center space-y-8">
      <div className="h-10 bg-gray-200 rounded w-1/3"></div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="h-32 bg-gray-100 rounded-2xl"></div><div className="h-32 bg-gray-100 rounded-2xl"></div><div className="h-32 bg-gray-100 rounded-2xl"></div></div>
      <div className="h-96 bg-gray-100 rounded-2xl w-full"></div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 bg-white dark:bg-[#1E2937] p-8 rounded-3xl shadow-sm border border-primary/20 dark:border-slate-700 dark:border-slate-700 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
         
         <div className="relative z-10">
           <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Welcome, {user?.companyName}</h1>
           <p className="text-gray-500 font-medium text-lg">Hiring Dashboard Overview</p>
         </div>
         <div className="flex flex-wrap gap-4 relative z-10">
           <Link to="/employer/post-job" className="bg-primary text-white px-6 py-3 rounded-xl border flex items-center justify-center gap-2 hover:bg-blue-700 font-extrabold shadow-lg shadow-primary/20 hover:-translate-y-1 transition-all">
             <FilePlus size={20} /> Post New Job
           </Link>
           <Link to="/employer/tracker" className="bg-white border-2 border-primary/20 dark:border-slate-700 text-gray-800 px-6 py-3 rounded-xl flex items-center justify-center gap-2 hover:border-gray-300 hover:bg-primary/5 font-extrabold transition-all">
             <Users size={20} /> View Tracker
           </Link>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-[#1E2937] p-8 rounded-3xl shadow-sm border border-primary/20 dark:border-slate-700 dark:border-slate-700 flex items-center gap-5 hover:-translate-y-1 transition duration-300">
           <div className="p-4 bg-primary/10 text-primary dark:text-blue-400 rounded-2xl border border-primary/20 shadow-sm"><Briefcase size={28} /></div>
           <div><p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Active Positions</p><p className="text-4xl font-extrabold text-gray-900 dark:text-white">{stats?.totalJobs || 0}</p></div>
        </div>
        <div className="bg-white dark:bg-[#1E2937] p-8 rounded-3xl shadow-sm border border-primary/20 dark:border-slate-700 dark:border-slate-700 flex items-center gap-5 hover:-translate-y-1 transition duration-300">
           <div className="p-4 bg-amber-50 dark:bg-amber-900/30 text-accent rounded-2xl border border-amber-200 dark:border-slate-600 shadow-sm"><Users size={28} /></div>
           <div><p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Total Applicants</p><p className="text-4xl font-extrabold text-gray-900 dark:text-white">{stats?.totalApplications || 0}</p></div>
        </div>
        <div className="bg-white dark:bg-[#1E2937] p-8 rounded-3xl shadow-sm border border-primary/20 dark:border-slate-700 dark:border-slate-700 flex items-center gap-5 hover:-translate-y-1 transition duration-300">
           <div className="p-4 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-2xl border border-green-200 dark:border-slate-600 shadow-sm"><Users size={28} /></div>
           <div><p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">Hired Candidates</p><p className="text-4xl font-extrabold text-gray-900 dark:text-white">{stats?.hiredApplications || 0}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-[#1E2937] rounded-3xl p-8 shadow-sm border border-primary/20 dark:border-slate-700 dark:border-slate-700">
          <h3 className="text-xl font-extrabold mb-8 text-gray-900 dark:text-white">Applicant Velocity (Recent 30 Days)</h3>
          <div className="h-72 w-full">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                  <Tooltip 
                     cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                     contentStyle={{ borderRadius: '16px', border: 'none', backgroundColor: '#1E2937', color: 'white', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', padding: '12px 16px', fontWeight: 600 }} 
                     itemStyle={{ color: '#F4A223', fontWeight: 800 }}
                  />
                  <Line type="monotone" dataKey="apps" name="Applications" stroke="#1A56A0" strokeWidth={4} activeDot={{ r: 8, strokeWidth: 0 }} dot={{ r: 5, strokeWidth: 3, fill: '#fff' }} />
               </LineChart>
             </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#1A56A0] to-[#123C73] rounded-3xl p-8 shadow-sm border-0 flex flex-col justify-between relative overflow-hidden">
           <div className="flex justify-between items-center mb-8 w-full relative z-10">
              <h3 className="text-xl font-extrabold text-white">Manage Pipeline</h3>
           </div>
           <div className="flex flex-col items-center justify-center flex-1 text-center bg-white rounded-2xl p-8 border border-primary/20 dark:border-slate-700 shadow-sm">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
               <Briefcase size={32} className="text-primary" />
             </div>
             <p className="text-gray-600 font-medium mb-6">Review applications and move candidates through your custom pipeline.</p>
             <Link to="/employer/tracker" className="w-full py-3.5 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:-translate-y-1">
               Open Kanban Tracker <ChevronRight size={18} />
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerDashboard;
