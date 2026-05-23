import { useState } from "react";
import { useLoaderData } from "react-router";
import axios from "axios";
import { Navbar } from "~/components/Navbar";
import { KanbanView } from "~/components/KanbanView";
import { CalendarView } from "~/components/CalendarView";
import { ListView } from "~/components/ListView";
import { api } from "~/lib/api";

type ViewType = "kanban" | "calendar" | "list";

type Project = {
  _id: string;
  title: string;
};

type Task = {
  _id: string;
  taskName: string;
  description?: string;
  status: "todo" | "in-progress" | "completed";
  priority: "Low" | "Medium" | "High";
  projectId: { _id: string; title: string };
  assignedTo?: { name: string; email: string };
  dueDate?: string;
};

export async function clientLoader() {
  try {
    const [tasksRes, projectsRes] = await Promise.all([
      api.get("/tasks"),
      api.get("/projects"),
    ]);
    const tasksData = tasksRes.data;
    const projectsData = projectsRes.data;
    return {
      tasks: Array.isArray(tasksData) ? tasksData : tasksData.tasks || [],
      projects: Array.isArray(projectsData) ? projectsData : projectsData.projects || []
    };
  } catch (error) {
    console.error("Loader error:", error);
    return { tasks: [], projects: [] };
  }
}

export default function Tasks() {
  const { tasks, projects } = useLoaderData<typeof clientLoader>() as { tasks: Task[], projects: Project[] };
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedView, setSelectedView] = useState<ViewType>("kanban");
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // --- NEW TASK STATE ---
  const [taskName, setTaskName] = useState("");

  const handleCreateTask = async () => {
    const userId = localStorage.getItem("userId");
    
    // Find the ID of the currently selected project name
    const projectObj = projects.find(p => p.title === selectedProject);

    if (!taskName.trim() || !projectObj) return;

    try {
      await api.post("/tasks", {
        taskName: taskName.trim(),
        projectId: projectObj._id,
        assignedTo: userId, // Default assign to creator
        status: "todo",
        priority: "Medium"
      });
      setTaskName("");
      window.location.reload();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Task creation failed";
      console.error("Task creation error:", error);
      alert(message);
    }
  };

  const handleCreateProject = async (title: string) => {
    const userId = localStorage.getItem("userId");
    if (!title.trim()) return;
    try {
      await api.post("/projects", { title: title.trim(), owner: userId });
      window.location.reload();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Project creation failed";
      console.error(error);
      alert(message);
    }
  };

  const dynamicProjects = ["All", ...projects.map((p) => p.title)];

  const filteredTasks = tasks.filter((task) => {
    const matchesProject = selectedProject === "All" || task.projectId?.title === selectedProject;
    const matchesSearch = task.taskName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProject && matchesSearch;
  });

  return (
    <div className="bg-base-200 min-h-screen w-full flex flex-col">
      <Navbar modifyType="project" />
      <div className="flex flex-1">
        <aside className="w-64 bg-base-100 p-6 flex flex-col gap-4 border-r border-base-300">
          <h3 className="font-bold mb-2">Projects</h3>
          <div className="flex flex-col gap-2">
            {dynamicProjects.map((project) => (
              <button key={project} onClick={() => setSelectedProject(project)}
                className={`btn btn-sm justify-start ${selectedProject === project ? "btn-primary" : "btn-ghost"}`}>
                {project}
              </button>
            ))}
            {showNewProjectInput ? (
              <div className="flex gap-1">
                <input type="text" placeholder="Project name" className="input input-bordered input-sm flex-1" autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateProject(e.currentTarget.value)} />
              </div>
            ) : (
              <button className="btn btn-sm btn-ghost justify-start text-primary" onClick={() => setShowNewProjectInput(true)}>
                + Add a new project
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="bg-base-100 px-6 py-4 flex items-center justify-between border-b border-base-200">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{selectedProject} View</h2>
              
              {/* --- NEW TASK INPUT (Visible only if a project is selected) --- */}
              {selectedProject !== "All" && (
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Quick add task..." 
                    className="input input-bordered input-sm w-48"
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateTask()}
                  />
                  <button className="btn btn-sm btn-primary" onClick={handleCreateTask}>Add Task</button>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              {["kanban", "calendar", "list"].map((view) => (
                <button key={view} onClick={() => setSelectedView(view as ViewType)}
                  className={`btn btn-sm capitalize ${selectedView === view ? "btn-neutral" : "btn-ghost"}`}>
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">
            {selectedView === "kanban" && <KanbanView tasks={filteredTasks} />}
            {selectedView === "calendar" && <CalendarView tasks={filteredTasks} />}
            {selectedView === "list" && <ListView tasks={filteredTasks} />}
          </div>
        </main>
      </div>
    </div>
  );
}