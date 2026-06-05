import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Link } from 'react-router-dom';
import { BookOpen, Award, Briefcase } from 'lucide-react';

const SkillProfile = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ coursesEnrolled: 0, certificates: 0, appliedJobs: 0 });
  const [radarData, setRadarData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [certs] = await Promise.all([
          api.get('/certificates/my')
        ]);
        setStats({
          coursesEnrolled: user.enrolledCourses?.length || 0,
          certificates: certs.data.count,
          appliedJobs: Math.floor(Math.random() * 5) // Mock applied jobs count
        });

        // Mock Radar Data based on Trade
        setRadarData([
          { subject: 'Safety', A: 80, fullMark: 100 },
          { subject: 'Tools', A: 90, fullMark: 100 },
          { subject: 'Installation', A: 65, fullMark: 100 },
          { subject: 'Theory', A: 70, fullMark: 100 },
          { subject: 'Speed', A: 85, fullMark: 100 },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchData();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-gray-500 animate-pulse">Loading Profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 w-full space-y-6">
          <div className="bg-white dark:bg-[#1E2937] rounded-3xl shadow-sm p-8 text-center border border-primary/20 dark:border-slate-700 dark:border-slate-700">
            <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 tracking-tighter shadow-inner">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
            <div className="mt-4 flex justify-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-bold">{user?.trade}</span>
              <span className="px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 rounded-full text-sm font-bold">{user?.skillLevel} Level</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-6 font-medium">{user?.experience} Years Experience • {user?.district}, {user?.state}</p>
          </div>

          <div className="bg-white dark:bg-[#1E2937] rounded-3xl shadow-sm p-8 border border-primary/20 dark:border-slate-700 dark:border-slate-700">
            <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><BookOpen size={20} /></div>
                <div><p className="text-sm text-gray-500">Enrolled Courses</p><p className="font-bold text-lg">{stats.coursesEnrolled}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Award size={20} /></div>
                <div><p className="text-sm text-gray-500">Certificates Earned</p><p className="font-bold text-lg">{stats.certificates}</p></div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Briefcase size={20} /></div>
                <div><p className="text-sm text-gray-500">Jobs Applied</p><p className="font-bold text-lg">{stats.appliedJobs}</p></div>
              </div>
            </div>
            <Link to="/courses" className="mt-6 w-full flex items-center justify-center bg-primary text-white py-2.5 rounded-xl font-medium hover:bg-blue-700 transition">
              Continue Learning
            </Link>
          </div>
        </div>

        {/* Right Column - Charts and Activity */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-white dark:bg-[#1E2937] rounded-3xl shadow-sm p-8 border border-primary/20 dark:border-slate-700 dark:border-slate-700 flex flex-col items-center">
            <h3 className="text-2xl font-extrabold mb-8 text-gray-900 dark:text-white w-full text-left">Skill Analysis</h3>
            <div className="h-[400px] w-full max-w-2xl flex items-center justify-center relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                  <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-600" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{fill: '#9ca3af'}} />
                  <Radar name="Skills" dataKey="A" stroke="#F4A223" strokeWidth={3} fill="#F4A223" fillOpacity={0.6} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillProfile;
