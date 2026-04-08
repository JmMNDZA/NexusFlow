export function CalendarView({ projectName }: { projectName: string }) {
  return (
    <div className="bg-base-100 rounded-box p-6">
      {/* Placeholder calendar grid */}
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
            <div key={i} className="aspect-square bg-base-200 rounded p-2 text-sm">
              {i + 1 <= 30 ? i + 1 : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CalendarView;