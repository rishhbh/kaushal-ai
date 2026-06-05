import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../hooks/useAuth';
import { Send, CheckCircle2 } from 'lucide-react';

const AssessmentChat = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: 'model', text: `Namaste ${user?.name || ''}! I am KaushalAI. I will ask you 5 questions to assess your skill level in ${user?.trade || 'your trade'}. Shall we start?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [questionsCount, setQuestionsCount] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMsg = { role: 'user', text: input };
    const newMessages = [...messages, newMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const isFinal = questionsCount >= 4;
      const { data } = await api.post('/ai/assess', { messages: newMessages, isFinal });
      
      if (data.isFinal) {
        setMessages(prev => [...prev, { role: 'model', text: "Assessment Complete!", assessment: data.data }]);
        if (user) {
          setUser({ ...user, skillLevel: data.data.skillLevel });
        }
      } else {
        setMessages(prev => [...prev, { role: 'model', text: data.text }]);
        setQuestionsCount(c => c + 1);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I had trouble understanding. Let's try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 h-[90vh] flex flex-col">
      <div className="bg-white rounded-t-2xl shadow-sm border border-b-0 p-4">
        <h2 className="text-xl font-bold text-primary">Skill Assessment</h2>
        <p className="text-sm text-gray-500">Answer 5 questions to complete your profile.</p>
      </div>
      
      <div className="flex-1 bg-gray-50 overflow-y-auto p-4 border-x flex flex-col gap-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl p-4 ${m.role === 'user' ? 'bg-primary text-white rounded-br-sm' : 'bg-white border rounded-bl-sm shadow-sm'}`}>
              {m.text}
              {m.assessment && (
                <div className="mt-4 pt-4 border-t border-primary/20 dark:border-slate-700">
                  <h4 className="font-bold mb-2 text-gray-900">Result: <span className="text-accent">{m.assessment.skillLevel}</span></h4>
                  <div className="mb-2">
                    <strong className="text-gray-800">Strengths:</strong>
                    <ul className="list-disc ml-4 text-sm text-green-700">{m.assessment.strengths.map((s,j) => <li key={j}>{s}</li>)}</ul>
                  </div>
                  <div>
                    <strong className="text-gray-800">Areas of Improvement:</strong>
                    <ul className="list-disc ml-4 text-sm text-red-700">{m.assessment.gaps.map((s,j) => <li key={j}>{s}</li>)}</ul>
                  </div>
                  <button onClick={() => navigate('/courses')} className="mt-4 w-full flex justify-center items-center gap-2 bg-accent text-white py-2 rounded-lg font-bold hover:bg-yellow-600 transition">
                    <CheckCircle2 size={18} /> View Learning Roadmap
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl p-4 shadow-sm flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="bg-white p-4 rounded-b-2xl border shadow-sm flex gap-2">
        <input 
          type="text" 
          className="flex-1 border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary outline-none"
          placeholder="Type your answer..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading || messages[messages.length-1].assessment}
        />
        <button 
          type="submit" 
          disabled={loading || !input.trim() || messages[messages.length-1].assessment}
          className="bg-primary text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <Send size={24} />
        </button>
      </form>
    </div>
  );
};

export default AssessmentChat;
