interface CalendarViewProps {
  projectName: string;
  searchQuery: string;
}

export function CalendarView({ projectName, searchQuery }: CalendarViewProps) {
  return (
    <div className="bg-base-100 rounded-box p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg">Calendar - {projectName}</h3>
        {searchQuery && (
          <span className="badge badge-primary badge-outline">
            Searching: {searchQuery}
          </span>
        )}
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <button className="btn btn-sm btn-ghost">Previous</button>
          <h4 className="font-semibold">April 2026</h4>
          <button className="btn btn-sm btn-ghost">Next</button>
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold text-sm p-2">
              {day}
            </div>
          ))}
          
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="aspect-square bg-base-200 rounded p-2 text-sm hover:bg-base-300 transition-colors cursor-pointer">
              {i + 1 <= 30 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;