import { useState } from "react";
import { Navbar } from "~/components/Navbar";
import { KanbanView } from "~/components/KanbanView";
import { CalendarView } from "~/components/CalendarView";
import { ListView } from "~/components/ListView";

export function meta() {
  return [
    { title: "Tasks | NexusFlow" },
    { name: "description", content: "Manage your tasks" },
  ];
}

type ViewType = "kanban" | "calendar" | "list";

const projects = ["All", "Project 1", "Project 2"];

export default function Tasks() {
  const [selectedProject, setSelectedProject] = useState("All");
  const [selectedView, setSelectedView] = useState<ViewType>("kanban");
  const [showNewProjectInput, setShowNewProjectInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const renderView = () => {
    switch (selectedView) {
      case "kanban":
        return <KanbanView projectName={selectedProject} searchQuery={searchQuery} />;
      case "calendar":
        return <CalendarView projectName={selectedProject} searchQuery={searchQuery} />;
      case "list":
        return <ListView projectName={selectedProject} searchQuery={searchQuery} />;
      default:
        return null;
    }
  };

  const getViewTitle = () => {
    switch (selectedView) {
      case "kanban":
        return "Kanban View";
      case "calendar":
        return "Calendar View";
      case "list":
        return "List View";
      default:
        return "";
    }
  };

  return (
    <div className="bg-base-200 min-h-screen w-full flex flex-col">
      <Navbar modifyType="project" />
      
      <div className="flex flex-1">
        <aside className="w-64 bg-base-100 p-6 flex flex-col gap-4">
          <h3 className="font-bold mb-2">Projects</h3>
          
          <div className="flex flex-col gap-2">
            {projects.map((project) => (
              <button
                key={project}
                onClick={() => setSelectedProject(project)}
                className={`btn btn-sm justify-start ${
                  selectedProject === project ? "btn-primary" : "btn-ghost"
                }`}
              >
                {project}
              </button>
            ))}
            
            {showNewProjectInput ? (
              <div className="flex gap-1">
                <input
                  type="text"
                  placeholder="Project name"
                  className="input input-bordered input-sm flex-1"
                  autoFocus
                />
                <button className="btn btn-sm btn-ghost" onClick={() => setShowNewProjectInput(false)}>
                  ✕
                </button>
              </div>
            ) : (
              <button
                className="btn btn-sm btn-ghost justify-start text-primary"
                onClick={() => setShowNewProjectInput(true)}
              >
                + Add a new project
              </button>
            )}
          </div>
        </aside>

        <main className="flex-1 flex flex-col">
          <div className="bg-base-100 px-6 py-4 flex items-center justify-between border-b border-base-200">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">{getViewTitle()}</h2>
              <div className="form-control">
                <input 
                  type="text" 
                  placeholder="Search tasks..." 
                  className="input input-bordered input-sm w-64" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedView("kanban")}
                className={`btn btn-sm ${selectedView === "kanban" ? "btn-neutral" : "btn-ghost"}`}
              >
                Kanban
              </button>
              <button
                onClick={() => setSelectedView("calendar")}
                className={`btn btn-sm ${selectedView === "calendar" ? "btn-neutral" : "btn-ghost"}`}
              >
                Calendar
              </button>
              <button
                onClick={() => setSelectedView("list")}
                className={`btn btn-sm ${selectedView === "list" ? "btn-neutral" : "btn-ghost"}`}
              >
                List
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 overflow-auto">
            {renderView()}
          </div>
        </main>
      </div>
    </div>
  );
}