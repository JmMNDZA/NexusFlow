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

function StatusBadge({ status }: { status: Task["status"] }) {
  const colorMap = {
    Requested: "badge-info",
    "In Progress": "badge-warning",
    Done: "badge-success",
  };

  return <span className={`badge ${colorMap[status]} badge-sm`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: Task["priority"] }) {
  const colorMap = {
    High: "badge-error",
    Medium: "badge-warning",
    Low: "badge-ghost",
  };

  return <span className={`badge ${colorMap[priority]} badge-sm`}>{priority}</span>;
}

export function ListView({ projectName }: { projectName: string }) {
    return (
    <div className="bg-base-100 rounded-box overflow-hidden">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="w-8">
                <input type="checkbox" className="checkbox checkbox-sm" />
              </th>
              <th>Task</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assignees</th>
            </tr>
          </thead>
          <tbody>
            {mockTasks.map((task) => (
              <tr key={task.id} className="hover">
                <td>
                  <input type="checkbox" className="checkbox checkbox-sm" />
                </td>
                <td className="font-semibold">{task.title}</td>
                <td className="text-sm text-base-content/70">{task.description}</td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="text-sm">{task.dueDate}</td>
                <td>
                  <div className="flex -space-x-2">
                    {Array.from({ length: task.assignees }).map((_, i) => (
                      <div key={i} className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-6 h-6 text-xs flex items-center justify-center ring-2 ring-base-100">
                          <span>A{i + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ListView;