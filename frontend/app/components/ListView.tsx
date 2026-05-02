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

interface ListViewProps {
  tasks: Task[];
}

function StatusBadge({ status }: { status: Task["status"] }) {
  const colorMap = {
    todo: "badge-info",
    "in-progress": "badge-warning",
    completed: "badge-success",
  };
  const labelMap = {
    todo: "To Do",
    "in-progress": "In Progress",
    completed: "Done",
  };

  return <span className={`badge ${colorMap[status]} badge-sm whitespace-nowrap`}>{labelMap[status]}</span>;
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const colorMap = {
    High: "badge-error text-white",
    Medium: "badge-warning",
    Low: "badge-success text-white",
  };

  return <span className={`badge ${colorMap[priority]} badge-sm`}>{priority}</span>;
}

export function ListView({ tasks }: ListViewProps) {
  return (
    <div className="bg-base-100 rounded-box overflow-hidden border border-base-300">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="w-8">
                <input type="checkbox" className="checkbox checkbox-sm" />
              </th>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover">
                <td>
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-semibold">{task.taskName}</span>
                    <span className="text-xs opacity-50">{task.projectId?.title}</span>
                  </div>
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="text-sm">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No Date"}
                </td>
                <td>
                  {task.assignedTo ? (
                    <div className="flex items-center gap-2">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-6 h-6 text-xs">
                          <span>{task.assignedTo.name[0]}</span>
                        </div>
                      </div>
                      <span className="text-xs">{task.assignedTo.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs opacity-30 italic">Unassigned</span>
                  )}
                </td>
              </tr>
            ))}
            {tasks.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-base-content/50 italic">
                  No tasks found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListView;