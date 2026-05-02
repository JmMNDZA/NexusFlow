import { useState, useEffect } from "react";
import api from "./api";

export function CalendarView({ projectName, searchQuery }: { projectName: string; searchQuery: string }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = projectName === "All" ? "/tasks" : `/tasks?project=${projectName}`;
        const response = await api.get(url);
        setTasks(response.data);
      } catch (error) {
        console.error("Failed to load tasks for calendar");
      }
    };
    fetchTasks();
  }, [projectName]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const calendarDays = [];
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, month: month - 1, year, currentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, month, year, currentMonth: true });
  }
  const remainingSlots = 42 - calendarDays.length;
  for (let i = 1; i <= remainingSlots; i++) {
    calendarDays.push({ day: i, month: month + 1, year, currentMonth: false });
  }

  return (
    <div className="bg-base-100 rounded-xl flex flex-col h-full border border-base-300 shadow-sm overflow-hidden">
      <div className="p-4 flex justify-between items-center border-b border-base-300">
        <h3 className="font-bold text-xl">{monthName} {year}</h3>
        <div className="join border border-base-300">
          <button className="join-item btn btn-sm btn-ghost" onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>«</button>
          <button className="join-item btn btn-sm btn-ghost" onClick={() => setCurrentDate(new Date())}>Today</button>
          <button className="join-item btn btn-sm btn-ghost" onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>»</button>
        </div>
      </div>

      <div className="grid grid-cols-7 bg-base-200 border-b border-base-300">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="py-2 text-center text-[10px] font-bold uppercase opacity-60">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1">
        {calendarDays.map((item, i) => {
          const dateString = new Date(item.year, item.month, item.day).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric'
          });

          // 2. Filter real tasks for THIS specific day
          const dayTasks = tasks.filter(t => t.dueDate === dateString && item.currentMonth);

          return (
            <div key={i} className={`min-h-[120px] p-2 border-r border-b border-base-300 hover:bg-base-200/30 transition-colors ${!item.currentMonth ? 'bg-base-200/20 opacity-40' : 'bg-base-100'}`}>
              <span className="text-sm font-medium">{item.day}</span>
              
              <div className="flex flex-col gap-1 mt-1">
                {dayTasks.map(task => (
                  <div key={task.id} className={`px-2 py-0.5 rounded text-[10px] font-bold truncate border-l-4 
                    ${task.priority === 'High' ? 'bg-error/10 border-error text-error' : 
                      task.priority === 'Medium' ? 'bg-warning/10 border-warning text-warning' : 'bg-info/10 border-info text-info'}`}>
                    {task.title}
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