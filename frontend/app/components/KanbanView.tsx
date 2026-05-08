import React, { useState } from 'react';
import axios from 'axios';
import { api } from '~/lib/api';
import { TaskModal } from './TaskModal'; 

interface Task {
  _id: string;
  taskName: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority: 'Low' | 'Medium' | 'High';
  projectId: { _id: string; title: string };
  assignedTo?: { name: string; email: string };
  dueDate?: string;
}

interface KanbanViewProps {
  tasks: Task[];
}

function TaskCard({ task, onClick }: { task: Task; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-base-100 rounded-box p-4 shadow-sm hover:shadow-md transition-shadow w-full cursor-pointer border border-base-300"
    >
      <div className="mb-1">
        <h4 className="font-semibold text-sm leading-tight">{task.taskName}</h4>
      </div>
      
      {task.description && (
        <p className="text-xs text-base-content/60 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex justify-between items-center mt-auto">
        <div className="flex -space-x-2">
          {task.assignedTo && (
            <div className="avatar placeholder">
              <div className="bg-neutral text-neutral-content rounded-full w-6 h-6 text-xs flex items-center justify-center ring-2 ring-base-100">
                <span>{task.assignedTo.name[0]}</span>
              </div>
            </div>
          )}
        </div>
        <span className="text-[10px] font-medium opacity-50">
          {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}
        </span>
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
    todo: "bg-info text-info-content",
    "in-progress": "bg-warning text-warning-content",
    completed: "bg-success text-success-content",
  };

  return (
    <div className="flex flex-col gap-3 min-w-[280px] flex-1">
      <div className={`${headerColors[status]} py-2 rounded-box font-bold text-xs uppercase tracking-widest text-center shadow-sm`}>
        {title} ({tasks.length})
      </div>
      
      <div className="flex flex-col gap-3 bg-base-200/50 p-2 rounded-box min-h-[500px]">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onClick={() => onTaskClick(task)} />
        ))}
      </div>
    </div>
  );
}

export function KanbanView({ tasks: initialTasks }: KanbanViewProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const getTasksByStatus = (status: Task["status"]) => 
    tasks.filter(task => task.status === status);

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    setSelectedTask(updatedTask);
  };

  return (
    <>
      <div className="flex gap-6 overflow-x-auto pb-4 p-2">
        <KanbanColumn 
          title="To Do" 
          status="todo" 
          tasks={getTasksByStatus("todo")} 
          onTaskClick={(task) => setSelectedTask(task)}
        />
        <KanbanColumn 
          title="In Progress" 
          status="in-progress" 
          tasks={getTasksByStatus("in-progress")} 
          onTaskClick={(task) => setSelectedTask(task)}
        />
        <KanbanColumn 
          title="Done" 
          status="completed" 
          tasks={getTasksByStatus("completed")} 
          onTaskClick={(task) => setSelectedTask(task)}
        />
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </>
  );
}

export default KanbanView;