import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import api from '../utils/api';
import { CheckCircle2, MessageCircle } from 'lucide-react';

const columns = ['Applied', 'Shortlisted', 'Interview', 'Hired'];

const ApplicantTracker = () => {
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [tasks, setTasks] = useState({
    Applied: [], Shortlisted: [], Interview: [], Hired: []
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try{
        const { data } = await api.get('/jobs');
        setJobs(data.data);
        if (data.data.length > 0) setSelectedJob(data.data[0]._id);
      } catch(e) { console.error(e) }
    };
    fetchJobs();
  }, []);

  useEffect(() => {
    if(!selectedJob) return;
    const fetchApps = async () => {
      try {
        const { data } = await api.get(`/jobs/${selectedJob}/applications`);
        const newTasks = { Applied: [], Shortlisted: [], Interview: [], Hired: [] };
        data.data.forEach(app => {
          if(newTasks[app.status]) newTasks[app.status].push(app);
        });
        setTasks(newTasks);
      } catch (e) { console.error(e) }
    };
    fetchApps();
  }, [selectedJob]);

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) return;

    const sourceCol = [...tasks[source.droppableId]];
    const destCol = [...tasks[destination.droppableId]];
    const [removed] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, removed);

    setTasks(prev => ({
      ...prev,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol
    }));

    try {
       await api.patch(`/applications/${removed._id}/status`, { status: destination.droppableId });
    } catch(e) {
       console.error("Failed to update status", e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-primary/20 dark:border-slate-700">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-800">Applicant Kanban</h1>
        <select className="border border-gray-300 rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-primary shadow-sm font-medium min-w-[200px] text-gray-700" value={selectedJob} onChange={e => setSelectedJob(e.target.value)}>
          {jobs.map(j => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-6 h-[calc(100vh-220px)] custom-scrollbar">
          {columns.map(col => (
            <div key={col} className="w-80 shrink-0 bg-gray-50/80 rounded-2xl border border-primary/20 dark:border-slate-700 flex flex-col max-h-full shadow-inner">
              <div className="p-4 font-bold border-b bg-white rounded-t-2xl flex justify-between items-center text-gray-700">
                {col} <span className="bg-primary text-white px-2.5 py-0.5 rounded-full text-sm">{tasks[col]?.length || 0}</span>
              </div>
              <Droppable droppableId={col}>
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className={`p-4 flex-1 overflow-y-auto space-y-4 ${snapshot.isDraggingOver ? 'bg-blue-50/50' : ''}`}>
                    {tasks[col]?.map((item, index) => (
                      <Draggable key={item._id} draggableId={item._id} index={index}>
                        {(provided, snapshot) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} 
                               className={`bg-white p-5 rounded-2xl shadow-sm border border-primary/20 dark:border-slate-700 ${snapshot.isDragging ? 'shadow-xl rotate-2 ring-2 ring-primary border-primary' : 'hover:border-gray-300 hover:shadow-md'} transition-all`}>
                            <p className="font-bold text-gray-900 text-lg mb-1">{item.userId?.name || 'Worker ID'}</p>
                            <div className="flex gap-2 mb-4">
                              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-xs font-semibold">{item.userId?.trade || 'Trade'}</span>
                              <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs font-semibold">{item.userId?.skillLevel || 'Lvl'}</span>
                            </div>
                            <div className="flex gap-2">
                               <button className="flex-1 bg-green-50 text-green-700 py-1.5 text-sm font-bold rounded-lg hover:bg-green-100 border border-green-200 transition-colors flex items-center justify-center gap-1">
                                 <MessageCircle size={14} /> Contact
                               </button>
                               <button className="flex-1 bg-blue-50 text-blue-700 py-1.5 text-sm font-bold rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-1">
                                 <CheckCircle2 size={14} /> Profile
                               </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
export default ApplicantTracker;
