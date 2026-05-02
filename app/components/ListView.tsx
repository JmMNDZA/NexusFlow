import { useState, useEffect } from "react";
import api from "./api";

// Helper components moved outside or imported
function StatusBadge({ status }: { status: string }) {
  const colorMap: Record<string, string> = {
    Requested: "badge-info",
    "In Progress": "badge-warning",
    Done: "badge-success",
  };
  return <span className={`badge ${colorMap[status] || "badge-ghost"} badge-sm`}>{status}</span>;
}

function PriorityBadge({ priority }: { priority: string }) {
  const colorMap: Record<string, string> = {
    High: "badge-error",
    Medium: "badge-warning",
    Low: "badge-ghost",
  };
  return <span className={`badge ${colorMap[priority] || "badge-ghost"} badge-sm`}>{priority}</span>;
}

export function ListView({ projectName, searchQuery, onTaskClick }: { projectName: string; searchQuery: string; onTaskClick: (task: any) => void }) {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
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

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div className="flex justify-center p-10"><span className="loading loading-dots loading-lg"></span></div>;

  return (
    <div className="bg-base-100 rounded-box overflow-hidden border border-base-300">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th className="w-8"><input type="checkbox" className="checkbox checkbox-sm" /></th>
              <th>Task</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Assignees</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((task) => (
              <tr key={task.id} className="hover cursor-pointer" onClick={() => onTaskClick(task)}>
                <td><input type="checkbox" className="checkbox checkbox-sm" onClick={(e) => e.stopPropagation()} /></td>
                <td>
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-xs opacity-50 truncate max-w-xs">{task.description}</div>
                </td>
                <td><StatusBadge status={task.status} /></td>
                <td><PriorityBadge priority={task.priority} /></td>
                <td className="text-sm">{task.dueDate}</td>
                <td>
                   <div className="flex -space-x-2">
                    {Array.from({ length: task.assignees || 1 }).map((_, i) => (
                      <div key={i} className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-6 h-6 text-[10px] ring-2 ring-base-100">
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