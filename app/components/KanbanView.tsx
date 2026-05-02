import { useState, useEffect } from 'react';
import { TaskModal } from './TaskModal';
import api from "./api";

interface Task {
  id: number;
  title: string;
  description: string;
  status: "Requested" | "In Progress" | "Done";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
}

export function KanbanView({ projectName, searchQuery }: { projectName: string; searchQuery: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        // Fetches tasks based on project. If "All", fetch everything.
        const url = projectName === "All" ? "/tasks" : `/tasks?project=${projectName}`;
        const response = await api.get(url);
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [projectName]);

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status: Task["status"]) => filteredTasks.filter(t => t.status === status);

  if (loading) return <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg"></span></div>;

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4">
        {(["Requested", "In Progress", "Done"] as const).map((status) => (
          <div key={status} className="flex flex-col gap-3 min-w-[280px] flex-1">
            <div className={`py-2 rounded-box font-bold text-xs uppercase text-center shadow-sm 
              ${status === "Requested" ? "bg-info text-info-content" : 
                status === "In Progress" ? "bg-warning text-warning-content" : "bg-success text-success-content"}`}>
              {status} ({getTasksByStatus(status).length})
            </div>
            <div className="flex flex-col gap-3 bg-base-200/50 p-2 rounded-box min-h-[500px]">
              {getTasksByStatus(status).map((task) => (
                <div key={task.id} onClick={() => setSelectedTask(task)} className="bg-base-100 rounded-box p-4 shadow-sm hover:shadow-md cursor-pointer border border-base-300">
                  <h4 className="font-semibold text-sm">{task.title}</h4>
                  <p className="text-xs opacity-60 mb-3 truncate">{task.description}</p>
                  <span className="text-[10px] opacity-50">{task.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {selectedTask && <TaskModal task={selectedTask} isOpen={!!selectedTask} onClose={() => setSelectedTask(null)} />}
    </>
  );
}