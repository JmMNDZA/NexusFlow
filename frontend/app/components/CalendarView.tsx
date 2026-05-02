interface Task {
  _id: string;
  taskName: string;
  status: 'todo' | 'in-progress' | 'completed';
  dueDate?: string;
}

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  // Simple check to see if a task falls on a specific day
  const getTasksForDay = (dayNum: number) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const date = new Date(task.dueDate);
      return date.getDate() === dayNum && date.getMonth() === 3; // Assuming April (Month 3) for now
    });
  };

  return (
    <div className="bg-base-100 rounded-box p-6 border border-base-300">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg">April 2026</h3>
        <div className="flex gap-2">
           <button className="btn btn-sm btn-outline">Prev</button>
           <button className="btn btn-sm btn-outline">Next</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-base-300 border border-base-300 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="bg-base-200 text-center font-bold text-xs py-3 opacity-60">
            {day}
          </div>
        ))}
        
        {Array.from({ length: 30 }).map((_, i) => {
          const dayTasks = getTasksForDay(i + 1);
          return (
            <div key={i} className="min-h-[100px] bg-base-100 p-2 text-sm hover:bg-base-200 transition-colors cursor-pointer group">
              <span className="font-medium opacity-50">{i + 1}</span>
              <div className="flex flex-col gap-1 mt-1">
                {dayTasks.map(t => (
                  <div key={t._id} className="text-[10px] bg-primary/10 text-primary px-1 rounded truncate border border-primary/20">
                    {t.taskName}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CalendarView;