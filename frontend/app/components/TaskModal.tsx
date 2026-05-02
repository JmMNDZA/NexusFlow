import { useState } from "react";

interface Comment {
  id: number;
  user: string;
  text: string;
  timestamp: string;
}

interface TaskModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskModal({ task, isOpen, onClose }: TaskModalProps) {
  const [comment, setComment] = useState("");
  
  // FIX: Initialized with an empty array to remove hardcoded "Mendoza" comment
  const [comments, setComments] = useState<Comment[]>([]);

  if (!isOpen) return null;

  const handleSendComment = () => {
    if (!comment.trim()) return;
    const newComment = {
      id: Date.now(),
      user: "You",
      text: comment,
      timestamp: "Just now"
    };
    setComments([...comments, newComment]);
    setComment("");
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/24 max-w-3xl bg-base-100 p-0 overflow-hidden flex flex-col h-[600px] border border-base-300 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-base-200 flex justify-between items-start bg-base-200/30">
          <div>
            {/* FIX: Changed task.title to task.taskName to match your data model */}
            <h3 className="text-xl font-bold">{task.taskName || "Untitled Task"}</h3>
            <p className="text-sm opacity-60">in Project {task.projectId?.title || "NexusFlow"}</p>
          </div>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Details Side */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-base-200">
            <h4 className="font-bold text-sm uppercase opacity-50 mb-4">Description</h4>
            <p className="text-sm mb-6">{task.description || "No description provided."}</p>
            
            <h4 className="font-bold text-sm uppercase opacity-50 mb-2">Attachments</h4>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center text-xs opacity-50">
              Drop files here or click to upload
            </div>
          </div>

          {/* Collaboration/Comments Side */}
          <div className="w-1/2 flex flex-col bg-base-100">
            <div className="p-4 border-b border-base-200 font-bold text-sm">Comments & Activity</div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {comments.map((c) => (
                <div key={c.id} className="chat chat-start">
                  <div className="chat-image avatar placeholder">
                    <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                      <span className="text-xs">{c.user[0]}</span>
                    </div>
                  </div>
                  <div className="chat-header opacity-50 text-[10px] ml-1">
                    {c.user} • {c.timestamp}
                  </div>
                  <div className="chat-bubble bg-base-200 text-base-content text-sm">{c.text}</div>
                </div>
              ))}
              
              {/* Added a subtle UI for empty comments */}
              {comments.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-20 text-center p-4">
                   <div className="text-xs uppercase tracking-widest">No activity yet</div>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-base-200/50">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type a comment..." 
                  className="input input-bordered input-sm flex-1"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                />
                <button className="btn btn-sm btn-primary" onClick={handleSendComment}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop bg-black/50" onClick={onClose}></div>
    </div>
  );
}