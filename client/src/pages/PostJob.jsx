import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Sparkles, Save } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', trade: 'Electrician', level: 'Beginner', location: '', salaryMin: '', salaryMax: '', certifications: ''
  });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const generateJD = async () => {
    setLoading(true);
    try {
      const payload = { ...formData, certifications: formData.certifications.split(',') };
      const { data } = await api.post('/ai/generate-jd', payload);
      setDescription(data.text);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requiredCertifications: formData.certifications.split(','),
      description
    };
    try {
      await api.post('/jobs', payload);
      alert('Job posted successfully!');
      navigate('/employer/dashboard');
    } catch(e) {
      console.error(e);
      alert('Failed to post job');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Post a New Job</h1>
      <div className="bg-white rounded-2xl shadow-sm border p-8 flex flex-col md:flex-row gap-8">
         <form onSubmit={handleSubmit} className="flex-1 space-y-5">
           <div>
             <label className="block text-sm font-medium mb-1.5 text-gray-700">Job Title</label>
             <input required type="text" className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
           </div>
           <div className="flex gap-4">
              <div className="flex-1">
                 <label className="block text-sm font-medium mb-1.5 text-gray-700">Trade</label>
                 <select className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.trade} onChange={e => setFormData({...formData, trade: e.target.value})}>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                 </select>
              </div>
              <div className="flex-1">
                 <label className="block text-sm font-medium mb-1.5 text-gray-700">Experience Level</label>
                 <select className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                 </select>
              </div>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1.5 text-gray-700">Location</label>
             <input required type="text" className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
           </div>
           <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                 <label className="block text-sm font-medium mb-1.5 text-gray-700">Salary Minimum (₹)</label>
                 <input type="number" className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.salaryMin} onChange={e => setFormData({...formData, salaryMin: e.target.value})} />
              </div>
              <div className="flex-1">
                 <label className="block text-sm font-medium mb-1.5 text-gray-700">Salary Maximum (₹)</label>
                 <input type="number" className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.salaryMax} onChange={e => setFormData({...formData, salaryMax: e.target.value})} />
              </div>
           </div>
           <div>
             <label className="block text-sm font-medium mb-1.5 text-gray-700">Required Certifications (comma separated)</label>
             <input type="text" className="w-full border rounded-xl p-3 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={formData.certifications} onChange={e => setFormData({...formData, certifications: e.target.value})} placeholder="e.g. KAUSHAL-CERT-E1" />
           </div>
           <button type="button" onClick={generateJD} disabled={loading} className="w-full py-3 bg-amber-50 border border-amber-200 text-amber-700 font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-amber-100 transition-colors shadow-sm mt-6">
             <Sparkles size={20} /> {loading ? 'Generating best JD...' : 'Generate Description with AI'}
           </button>
           <div>
             <label className="block text-sm font-medium mb-1.5 mt-4 text-gray-700">Job Description</label>
             <textarea required rows={6} className="w-full border rounded-xl p-4 focus:ring-primary focus:ring-2 outline-none transition-shadow" value={description} onChange={e => setDescription(e.target.value)}></textarea>
           </div>
           <button type="submit" className="w-full bg-primary text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-blue-700 transition shadow-sm mt-4 text-lg">
             <Save size={20} /> Publish Job Post
           </button>
         </form>
      </div>
    </div>
  );
};
export default PostJob;
