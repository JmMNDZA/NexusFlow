import { useState, useEffect } from 'react';
import { TaskModal } from './TaskModal';

interface Task {
  _id: string;
  taskName: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  priority?: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  projectId: { _id: string; title: string };
  assignedTo?: { name: string; email: string };
}

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks: initialTasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [daysInMonth, setDaysInMonth] = useState(31);
  const [firstDayOfWeek, setFirstDayOfWeek] = useState(0);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  // Sync tasks when props change
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  // Update calendar when current date changes
  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const date = new Date(year, month + 1, 0);
    setDaysInMonth(date.getDate());
    const first = new Date(year, month, 1);
    setFirstDayOfWeek(first.getDay());
  }, [currentDate]);

  // Get tasks for a specific day
  const getTasksForDay = (dayNum: number) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      
      // Parse ISO date string correctly to avoid timezone issues
      const dateStr = task.dueDate.split('T')[0]; // Extract YYYY-MM-DD part
      const [taskYear, taskMonth, taskDay] = dateStr.split('-').map(Number);
      
      return (
        taskDay === dayNum &&
        taskMonth === month + 1 &&
        taskYear === year
      );
    });
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task._id === updatedTask._id ? updatedTask : task
    ));
    setSelectedTask(updatedTask);
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-base-100 rounded-box p-6 border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">{monthYear}</h3>
        <div className="flex gap-2">
           <button className="btn btn-sm btn-outline" onClick={handlePrevMonth}>Prev</button>
           <button className="btn btn-sm btn-outline" onClick={handleNextMonth}>Next</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-base-300 border border-base-300 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-base-200 text-center font-bold text-xs py-3 opacity-60">
            {day}
          </div>
        ))}
        
        {/* Empty cells for days before month starts */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-base-200/30 p-2 text-sm"></div>
        ))}
        
        {/* Days of the month */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1;
          const dayTasks = getTasksForDay(dayNum);
          return (
            <div key={dayNum} className="min-h-[100px] bg-base-100 p-2 text-sm hover:bg-base-200 transition-colors cursor-pointer group border border-base-300">
              <span className="font-medium opacity-50">{dayNum}</span>
              <div className="flex flex-col gap-1 mt-1">
                {dayTasks.map(t => (
                  <div 
                    key={t._id} 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTask(t);
                    }}
                    className="text-[10px] bg-primary/10 text-primary px-1 rounded truncate border border-primary/20 cursor-pointer hover:bg-primary/20 transition-colors"
                  >
                    {t.taskName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          isOpen={!!selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onTaskUpdate={handleTaskUpdate}
        />
      )}
    </div>
  );
}

export default CalendarView;