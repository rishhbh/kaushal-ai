import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../utils/api';
import { FileText, Download, Sparkles, AlertCircle } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import ReactMarkdown from 'react-markdown';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('build');
  const [resumeData, setResumeData] = useState({
    previousWork: 'Handled residential wiring for 3 years locally.',
    skills: ['Wiring', 'Safety', 'Reading Diagrams'],
    certifications: ['KaushalAI - Electrical Fundamentals'],
    completedCourses: ['Electrical Fundamentals']
  });
  const [generatedResume, setGeneratedResume] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [analyzeText, setAnalyzeText] = useState('');
  const [analysis, setAnalysis] = useState(null);

  const resumeRef = useRef();

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/ai/generate-resume', resumeData);
      setGeneratedResume(data.data.generatedText);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    const canvas = await html2canvas(resumeRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Resume_${user.name}.pdf`);
  };

  const handleAnalyze = async () => {
    if(!analyzeText) return;
    setLoading(true);
    try {
      const { data } = await api.post('/ai/analyze-resume', { text: analyzeText });
      setAnalysis(data.data);
    } catch(e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex gap-2 mb-10 bg-gray-50 dark:bg-[#0F172A] p-2 border border-primary/20 dark:border-slate-700 dark:border-slate-700 rounded-xl shadow-sm w-full max-w-md mx-auto relative z-10">
        <button onClick={() => setActiveTab('build')} className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'build' ? 'bg-white dark:bg-[#1E2937] text-primary dark:text-blue-400 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700' : 'text-gray-500 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-[#1E2937]/50'}`}>
          <FileText size={18} /> Build Resume
        </button>
        <button onClick={() => setActiveTab('analyze')} className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${activeTab === 'analyze' ? 'bg-white dark:bg-[#1E2937] text-primary dark:text-blue-400 shadow-sm ring-1 ring-gray-200 dark:ring-slate-700' : 'text-gray-500 dark:text-gray-400 hover:bg-primary/5 dark:hover:bg-[#1E2937]/50'}`}>
          <Sparkles size={18} /> Analyze Resume
        </button>
      </div>

      {activeTab === 'build' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-4">
            <h3 className="text-xl font-bold mb-4">Your Information</h3>
            <div>
               <label className="block text-sm font-medium mb-1">Previous Work Experience</label>
               <textarea rows={4} className="w-full border rounded-lg p-3 focus:ring-primary focus:ring-2 outline-none" value={resumeData.previousWork} onChange={e => setResumeData({...resumeData, previousWork: e.target.value})}></textarea>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
               <input type="text" className="w-full border rounded-lg p-3 focus:ring-primary focus:ring-2 outline-none" value={resumeData.skills.join(', ')} onChange={e => setResumeData({...resumeData, skills: e.target.value.split(',')})} />
            </div>
            <button onClick={handleGenerate} disabled={loading} className="w-full bg-accent text-white font-bold text-lg py-3 rounded-xl hover:bg-yellow-600 transition shadow-sm flex items-center justify-center gap-2 mt-4">
               {loading ? 'AI is thinking...' : <><Sparkles size={20} /> Generate AI Resume</>}
            </button>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border flex flex-col items-center overflow-x-auto">
            {generatedResume ? (
              <>
                <div ref={resumeRef} className="!bg-white !text-[#1A1A2E] w-full max-w-[800px] mx-auto min-h-[297mm] h-max p-10 md:p-14 shadow-sm border border-gray-200 text-sm whitespace-pre-wrap font-sans text-left shrink-0 origin-top transform scale-75 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h2]:text-xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:mb-3 [&_h3]:text-lg [&_h3]:font-semibold [&_ul]:list-disc [&_ul]:ml-6 [&_li]:mb-1 [&_p]:mb-3 [&_strong]:font-bold">
                  <ReactMarkdown>{generatedResume}</ReactMarkdown>
                </div>
                <button onClick={downloadPDF} className="mt-4 bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition shadow-sm">
                  <Download size={20} /> Download PDF
                </button>
              </>
            ) : (
               <div className="text-gray-400 text-center py-20 w-full bg-gray-50 dark:bg-gray-800/10 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl">Your resume will appear here...</div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
           <textarea rows={10} className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none text-sm mb-4" placeholder="Paste your resume text here..." value={analyzeText} onChange={e => setAnalyzeText(e.target.value)}></textarea>
           <button onClick={handleAnalyze} disabled={loading} className="max-w-md w-full mx-auto block bg-primary text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition shadow-sm">
             {loading ? 'Analyzing...' : 'Analyze with AI'}
           </button>

           {analysis && (
             <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div className="bg-green-50 border border-green-200 p-5 rounded-xl">
                  <h4 className="font-bold text-green-800 mb-3 text-lg">Strengths</h4>
                  <ul className="list-disc ml-4 text-green-700 text-sm space-y-1.5 font-medium">
                    {analysis.strengths.map((s,i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-red-50 border border-red-200 p-5 rounded-xl">
                  <h4 className="font-bold text-red-800 mb-3 text-lg">Weaknesses</h4>
                  <ul className="list-disc ml-4 text-red-700 text-sm space-y-1.5 font-medium">
                    {analysis.weaknesses.map((s,i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
                <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl md:col-span-2 flex items-start gap-4">
                  <AlertCircle className="text-amber-600 mt-1 shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-amber-800 mb-1 text-lg">Missing Certifications</h4>
                    <p className="text-sm text-amber-900 font-medium">{analysis.missingCertifications.join(', ')}</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl md:col-span-2">
                   <h4 className="font-bold text-blue-800 mb-3 border-b border-blue-200 pb-2 text-lg">Improvement Suggestions</h4>
                   <ul className="list-decimal ml-4 text-blue-900 text-sm space-y-2 font-medium">
                    {analysis.improvementSuggestions.map((s,i) => <li key={i}>{s}</li>)}
                  </ul>
                </div>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default ResumeBuilder;
