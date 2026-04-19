import React, { useState } from 'react';
import { TaskModal } from './TaskModal'; 

// Unified Task Interface
interface Task {
  id: number;
  title: string;
  description: string;
  status: "Requested" | "In Progress" | "Done";
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  assignees: number;
}

const mockTasks: Task[] = [
  { id: 1, title: "Task Assignment #1", description: "Lorem Ipsum dolor sit amet", status: "Requested", priority: "High", dueDate: "Apr 15, 2026", assignees: 3 },
  { id: 2, title: "Task Assignment #2", description: "Lorem Ipsum dolor sit amet", status: "Requested", priority: "Medium", dueDate: "Apr 18, 2026", assignees: 2 },
  { id: 3, title: "Task Assignment #3", description: "Lorem Ipsum dolor sit amet", status: "In Progress", priority: "High", dueDate: "Apr 12, 2026", assignees: 1 },
  { id: 4, title: "Task Assignment #4", description: "Lorem Ipsum dolor sit amet", status: "Requested", priority: "Low", dueDate: "Apr 25, 2026", assignees: 2 },
  { id: 5, title: "Task Assignment #5", description: "Lorem Ipsum dolor sit amet", status: "In Progress", priority: "Medium", dueDate: "Apr 20, 2026", assignees: 3 },
  { id: 6, title: "Task Assignment #6", description: "Lorem Ipsum dolor sit amet", status: "Done", priority: "High", dueDate: "Apr 10, 2026", assignees: 2 },
  { id: 7, title: "Task Assignment #7", description: "Lorem Ipsum dolor sit amet", status: "Done", priority: "Low", dueDate: "Apr 8, 2026", assignees: 1 },
  { id: 8, title: "Task Assignment #8", description: "Lorem Ipsum dolor sit amet", status: "In Progress", priority: "Medium", dueDate: "Apr 22, 2026", assignees: 2 },
];

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-base-100 rounded-box p-4 shadow-sm hover:shadow-md transition-shadow w-full cursor-pointer border border-base-300"
    >
      <h4 className="font-semibold text-sm mb-1">{task.title}</h4>
      <p className="text-xs text-base-content/60 mb-3">{task.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex -space-x-2">
          {Array.from({ length: task.assignees }).map((_, i) => (
            <div key={i} className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-6 h-6 text-xs flex items-center justify-center ring-2 ring-base-100">
                <span>A</span>
              </div>
            </div>
          ))}
        </div>
        <span className="text-[10px] font-medium opacity-50">{task.dueDate}</span>
      </div>
    </div>
  );
}

function KanbanColumn({ title, tasks, status, onTaskClick }: { 
  title: string; 
  tasks: Task[]; 
  status: Task["status"];
  onTaskClick: (task: Task) => void;
}) {
  const headerColors = {
    Requested: "bg-info text-info-content",
    "In Progress": "bg-warning text-warning-content",
    Done: "bg-success text-success-content",
  };

  return (
    <div className="flex flex-col gap-3 min-w-[280px] flex-1">
      <div className={`${headerColors[status]} py-2 rounded-box font-bold text-xs uppercase tracking-widest text-center shadow-sm`}>
        {title} ({tasks.length})
      </div>
      
      <div className="flex flex-col gap-3 bg-base-200/50 p-2 rounded-box min-h-[500px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}

export function KanbanView({ projectName, searchQuery }: { projectName: string; searchQuery: string }) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const filteredTasks = mockTasks.filter((task) => {
    const matchesSearch = 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getTasksByStatus = (status: Task["status"]) => 
    filteredTasks.filter(task => task.status === status);

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4 p-2">
        <KanbanColumn 
          title="Requested" 
          status="Requested" 
          tasks={getTasksByStatus("Requested")} 
          onTaskClick={setSelectedTask} 
        />
        <KanbanColumn 
          title="In Progress" 
          status="In Progress" 
          tasks={getTasksByStatus("In Progress")} 
          onTaskClick={setSelectedTask} 
        />
        <KanbanColumn 
          title="Done" 
          status="Done" 
          tasks={getTasksByStatus("Done")} 
          onTaskClick={setSelectedTask} 
        />
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
        />
      )}
    </>
  );
}

export default KanbanView;