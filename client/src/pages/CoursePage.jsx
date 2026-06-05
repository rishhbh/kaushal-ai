import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { CheckCircle2, Lock, PlayCircle, Bot, Send, CheckCircle, XCircle } from 'lucide-react';

const CoursePage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [doubtText, setDoubtText] = useState('');
  const [doubtReply, setDoubtReply] = useState('');
  const [doubtLoading, setDoubtLoading] = useState(false);
  const [askAiOpen, setAskAiOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(`/courses/${id}`);
        setCourse(data.data);
        if (user?.enrolledCourses?.includes(id)) {
          setEnrollment({ currentModuleIndex: 0, moduleProgress: [] });
        }
      } catch (err) {
        toast.error('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, user]);

  useEffect(() => {
    setQuizAnswers({});
    setQuizSubmitted(false);
  }, [activeModuleIndex]);

  const handleEnroll = async () => {
    try {
      const { data } = await api.post(`/courses/${id}/enroll`);
      setEnrollment(data.data);
      if(user) user.enrolledCourses.push(id);
      toast.success('Successfully enrolled!');
    } catch (e) {
      toast.error('Could not enroll. Try again later.');
    }
  };

  const handleQuizSubmit = async () => {
    try {
      setQuizSubmitted(true);
      const module = course.modules[activeModuleIndex];
      const answeredCount = Object.keys(quizAnswers).length;
      
      if (answeredCount < module.quiz.length) {
        toast.error('Please answer all questions!');
        setQuizSubmitted(false);
        return;
      }

      // Assume passing score is all correct or >= length - 1 (backend dependent, mocking here)
      const score = Object.values(quizAnswers).filter(v => typeof v !== 'undefined').length;
      if (score >= module.quiz.length - 1) { 
         await api.patch(`/courses/${id}/progress`, { moduleId: module._id, score });
         toast.success('Module Passed! 🎉');
         
         const newIndex = activeModuleIndex + 1;
         if (newIndex >= course.modules.length) {
            toast.success('Course Completed! Generating Certificate...', { duration: 5000 });
            localStorage.setItem('certificateConfetti', 'true');
            const certReq = await api.post('/certificates/generate', { courseId: id });
            navigate(`/certificate/${certReq.data.data.certUUID}`);
         } else {
            setTimeout(() => {
               setActiveModuleIndex(newIndex);
               window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 1500);
         }
      } else {
         toast.error('You need to review the material to pass the quiz. Try again!');
      }
    } catch (e) {
      toast.error('Error submitting quiz.');
    }
  };

  const askDoubt = async (e) => {
    e.preventDefault();
    if (!doubtText.trim()) return;
    setDoubtLoading(true);
    try {
      const { data } = await api.post('/ai/doubt', { 
        moduleTopic: course.modules[activeModuleIndex].title, 
        question: doubtText 
      });
      setDoubtReply(data.text);
    } catch (e) {
      toast.error("AI is currently unavailable.");
    } finally {
      setDoubtLoading(false);
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
      <div className="w-full h-48 bg-gray-200 rounded-3xl mb-8"></div>
      <div className="flex gap-8"><div className="w-1/4 h-96 bg-gray-100 rounded-2xl"></div><div className="w-3/4 h-[600px] bg-gray-100 rounded-2xl"></div></div>
    </div>
  );
  
  if (!course) return <div className="p-8 text-center text-gray-500 font-bold text-2xl">Course not found</div>;

  const isEnrolled = !!enrollment || user?.enrolledCourses?.includes(id);
  const progressPercent = course.modules.length ? Math.max(10, Math.round(((activeModuleIndex + 0.5) / course.modules.length) * 100)) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
      <div className="bg-gradient-to-br from-[#1A56A0] to-[#123C73] text-white rounded-3xl p-8 sm:p-12 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent opacity-10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>
        
        <div className="relative z-10">
          <span className="bg-white/10 border border-primary/20/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6 inline-block shadow-sm">
            {course.trade} • {course.level}
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 tracking-tight leading-tight">{course.title}</h1>
          <p className="text-blue-100/90 text-lg max-w-3xl mb-8 leading-relaxed font-medium">{course.description}</p>
          
          {!isEnrolled ? (
            <button onClick={handleEnroll} className="bg-accent text-gray-900 px-8 py-4 rounded-xl font-extrabold hover:bg-yellow-500 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg">
              Enroll For Free
            </button>
          ) : (
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center bg-white/10 p-4 rounded-2xl border border-primary/20/10 backdrop-blur-sm max-w-md">
              <span className="bg-green-500/20 text-green-300 border border-green-500/30 px-4 py-1.5 rounded-lg font-bold text-sm tracking-wide">
                Enrolled
              </span>
              <div className="flex-1 w-full">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Course Progress</span>
                  <span>{activeModuleIndex} of {course.modules.length} Modules</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-accent h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {isEnrolled && course.modules && (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Roadmap */}
          <div className="lg:w-1/3 xl:w-1/4 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-primary/20 dark:border-slate-700 sticky top-24">
              <h3 className="font-extrabold text-gray-900 mb-6 text-lg uppercase tracking-wider">Learning Path</h3>
              <div className="space-y-0 relative before:absolute before:inset-0 before:ml-[1.4rem] before:h-full before:w-[2px] before:bg-gray-100">
                {course.modules.map((mod, i) => {
                  const isActive = activeModuleIndex === i;
                  const isCompleted = activeModuleIndex > i;
                  const isLocked = activeModuleIndex < i;
                  
                  return (
                    <div key={mod._id} className="relative flex items-start group mb-8 last:mb-0">
                      <div className={`flex items-center justify-center w-11 h-11 rounded-full border-4 border-primary/20 shadow-sm shrink-0 z-10 transition-colors duration-300 ${
                        isActive ? 'bg-primary text-white ring-4 ring-blue-50' : 
                        isCompleted ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCompleted ? <CheckCircle2 size={18} strokeWidth={3} /> : (isActive ? <PlayCircle size={20} fill="currentColor" className="text-white" /> : <Lock size={16} />)}
                      </div>
                      <button 
                        onClick={() => !isLocked && setActiveModuleIndex(i)} 
                        className={`ml-4 outline-none text-left pt-2 transition-all ${!isLocked ? 'cursor-pointer hover:text-primary' : 'cursor-not-allowed opacity-50'}`}
                      >
                        <span className={`text-xs font-bold uppercase tracking-wider mb-1 block ${isActive ? 'text-primary' : (isCompleted ? 'text-green-600' : 'text-gray-400')}`}>
                          Module {i + 1}
                        </span>
                        <h4 className={`font-bold leading-tight ${isActive ? 'text-gray-900 text-lg' : 'text-gray-600'}`}>{mod.title}</h4>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-2/3 xl:w-3/4 flex flex-col gap-6">
            <div className="bg-white border border-primary/20 dark:border-slate-700 rounded-3xl p-8 sm:p-10 shadow-sm animate-fade-in">
              <h2 className="text-3xl font-extrabold mb-8 text-gray-900 border-b border-primary/20 dark:border-slate-700 pb-6">{course.modules[activeModuleIndex].title}</h2>
              <div className="prose max-w-none text-gray-700 mb-10 text-lg leading-relaxed whitespace-pre-wrap font-medium">
                {course.modules[activeModuleIndex].contentText}
              </div>

              {/* Quiz Section */}
              <div className="bg-blue-50/50 rounded-3xl p-8 border border-blue-100">
                <div className="flex items-center gap-3 mb-8">
                   <div className="bg-blue-600 text-white p-2 rounded-xl"><CheckCircle2 size={24} /></div>
                   <h3 className="font-extrabold text-2xl text-gray-900">Module Quiz</h3>
                </div>
                
                <div className="space-y-8">
                  {course.modules[activeModuleIndex].quiz.map((q, qIndex) => (
                    <div key={qIndex} className="bg-white p-6 rounded-2xl shadow-sm border border-primary/20 dark:border-slate-700">
                      <p className="font-bold text-gray-900 mb-4 text-lg">{qIndex + 1}. {q.question}</p>
                      <div className="grid grid-cols-1 gap-3">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = quizAnswers[qIndex] === optIndex;
                          let btnClass = "border-primary/20 dark:border-slate-700 text-gray-700 bg-white hover:bg-primary/5";
                          if (isSelected) btnClass = "border-primary bg-primary/5 text-primary ring-1 ring-primary";
                          // Added visual check states if submitted
                          if (quizSubmitted && isSelected) {
                             btnClass = "border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500"; // Assuming we don't know correct visually until success
                          }
                          return (
                            <label key={optIndex} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${btnClass}`}>
                              <input 
                                type="radio" name={`quiz-${qIndex}`} 
                                checked={isSelected} 
                                onChange={() => {
                                  if(!quizSubmitted) setQuizAnswers({...quizAnswers, [qIndex]: optIndex});
                                }} 
                                className="w-5 h-5 text-primary border-gray-300 focus:ring-primary focus:ring-opacity-50" 
                                disabled={quizSubmitted}
                              />
                              <span className="font-medium text-[15px]">{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={handleQuizSubmit} 
                    className="w-full bg-primary text-white font-extrabold text-xl py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                  >
                    Submit Answers & Continue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Ask AI Button (Verified only if enrolled) */}
      {isEnrolled && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
          {askAiOpen && (
            <div className="mb-4 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-primary/20 dark:border-slate-700 overflow-hidden animate-slide-up origin-bottom-right">
              <div className="bg-gradient-to-r from-primary to-blue-700 p-4 text-white font-bold flex justify-between items-center">
                <span className="flex items-center gap-2"><Bot size={20} /> Ask KaushalAI</span>
                <button onClick={() => setAskAiOpen(false)} className="hover:bg-white/20 p-1 rounded transition"><XCircle size={20}/></button>
              </div>
              <div className="p-4 bg-gray-50 min-h-[150px] max-h-[300px] overflow-y-auto text-sm text-gray-700 font-medium">
                {doubtReply ? (
                  <div className="bg-white p-3 rounded-xl shadow-sm border border-primary/20 dark:border-slate-700 leading-relaxed whitespace-pre-wrap">{doubtReply}</div>
                ) : (
                  <div className="text-gray-400 text-center py-10">Ask any doubt regarding <b>{course?.modules[activeModuleIndex]?.title}</b>.</div>
                )}
                {doubtLoading && <div className="text-primary font-bold text-center mt-4 animate-pulse">KaushalAI is typing...</div>}
              </div>
              <form onSubmit={askDoubt} className="p-3 bg-white border-t border-primary/20 dark:border-slate-700 flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 px-4 py-2 font-medium bg-gray-50 border border-primary/20 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary outline-none" 
                  placeholder="Type your question..." 
                  value={doubtText} 
                  onChange={e => setDoubtText(e.target.value)} 
                />
                <button type="submit" disabled={doubtLoading || !doubtText.trim()} className="bg-primary text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition"><Send size={18}/></button>
              </form>
            </div>
          )}
          
          <button 
            onClick={() => setAskAiOpen(!askAiOpen)} 
            className="w-14 h-14 bg-gradient-to-r from-accent to-yellow-500 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 hover:rotate-6 transition-transform hover:shadow-yellow-500/30"
            title="Ask KaushalAI"
          >
            <Bot size={28} />
          </button>
        </div>
      )}
    </div>
  );
};

export default CoursePage;
