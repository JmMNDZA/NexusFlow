import { useState, useEffect } from "react";
import { Navbar } from "~/components/Navbar";
import { KanbanView } from "~/components/KanbanView";
import { CalendarView } from "~/components/CalendarView";
import { ListView } from "~/components/ListView";
import api from "~/components/api";
export function meta() {
  return [
    { title: "Tasks | NexusFlow" },
    { name: "description", content: "Manage your tasks" },
  ];
}

type ViewType = "kanban" | "calendar" | "list";

export default function Tasks() {
  const [projects, setProjects] = useState<string[]>(["All"]); // Start with "All"
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedView, setSelectedView] = useState<ViewType>("kanban");
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Feature: Fetch real projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get("/projects");
        setProjects(["All", ...response.data.map((p: any) => p.name)]);
      } catch (error) {
        console.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);

  const handleAddProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await api.post("/projects", { name: newProjectName });
      setProjects([...projects, newProjectName]);
      setNewProjectName("");
      setShowNewProjectInput(false);
    } catch (error) {
      console.error("Error creating project");
    }
  };

  const renderView = () => {
    const props = { projectName: selectedProject, searchQuery };
    switch (selectedView) {
      case "kanban": return <KanbanView {...props} />;
      case "calendar": return <CalendarView {...props} />;
      case "list": return <ListView {...props} />;
      default: return null;
    }
  };

  return (
    <div className="bg-base-200 min-h-screen w-full flex flex-col">
      <Navbar modifyType="project" />
      <div className="flex flex-1">
        <aside className="w-64 bg-base-100 p-6 flex flex-col gap-4 border-r border-base-300">
          <h3 className="font-bold mb-2">Projects</h3>
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <button
                key={project}
                onClick={() => setSelectedProject(project)}
                className={`btn btn-sm justify-start ${selectedProject === project ? "btn-primary" : "btn-ghost"}`}
              >
                {project}
              </button>
            ))}
            {showNewProjectInput ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="Project name"
                  className="input input-bordered input-sm w-full"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-1">
                  <button className="btn btn-xs btn-primary flex-1" onClick={handleAddProject}>Add</button>
                  <button className="btn btn-xs btn-ghost" onClick={() => setShowNewProjectInput(false)}>✕</button>
                </div>
              </div>
            ) : (
              <button className="btn btn-sm btn-ghost justify-start text-primary" onClick={() => setShowNewProjectInput(true)}>
                + New Project
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="bg-base-100 px-6 py-4 flex items-center justify-between border-b border-base-200">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold capitalize">{selectedView} View</h2>
              <input 
                type="text" 
                placeholder="Search tasks..." 
                className="input input-bordered input-sm w-64" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              {(["kanban", "calendar", "list"] as ViewType[]).map((view) => (
                <button
                  key={view}
                  onClick={() => setSelectedView(view)}
                  className={`btn btn-sm capitalize ${selectedView === view ? "btn-neutral" : "btn-ghost"}`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 p-6 overflow-auto">{renderView()}</div>
        </main>
      </div>
    </div>
  );
}