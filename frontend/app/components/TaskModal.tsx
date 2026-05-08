import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "~/lib/api";

interface Comment {
  _id: string;
  author: { name: string; email: string; _id: string };
  content: string;
  createdAt: string;
}

interface TaskModalProps {
  task: any;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdate?: (updatedTask: any) => void;
}

export function TaskModal({ task, isOpen, onClose, onTaskUpdate }: TaskModalProps) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingDeadline, setUpdatingDeadline] = useState(false);
  const [updatingDescription, setUpdatingDescription] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState("");

  // Update local task when prop changes
  useEffect(() => {
    setCurrentTask(task);
  }, [task]);

  // Fetch comments from backend when modal opens
  useEffect(() => {
    if (isOpen && task._id) {
      fetchComments();
    }
  }, [isOpen, task._id]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/comments/task/${task._id}`);
      setComments(Array.isArray(res.data) ? res.data : res.data.comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      const res = await api.put(`/tasks/${currentTask._id}`, {
        status: newStatus
      });
      const updatedTask = res.data;
      setCurrentTask(updatedTask);
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to update task status";
      console.error("Error updating task status:", error);
      alert(`Error: ${message}`);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeadlineChange = async (date: string) => {
    try {
      setUpdatingDeadline(true);
      const res = await api.put(`/tasks/${currentTask._id}`, {
        dueDate: date ? new Date(date).toISOString() : null
      });
      const updatedTask = res.data;
      setCurrentTask(updatedTask);
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      setShowDeadlinePicker(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to update deadline";
      console.error("Error updating deadline:", error);
      alert(`Error: ${message}`);
    } finally {
      setUpdatingDeadline(false);
    }
  };

  const handleDescriptionChange = async () => {
    try {
      setUpdatingDescription(true);
      const res = await api.put(`/tasks/${currentTask._id}`, {
        description: descriptionText.trim()
      });
      const updatedTask = res.data;
      setCurrentTask(updatedTask);
      if (onTaskUpdate) {
        onTaskUpdate(updatedTask);
      }
      setEditingDescription(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to update description";
      console.error("Error updating description:", error);
      alert(`Error: ${message}`);
    } finally {
      setUpdatingDescription(false);
    }
  };

  const startEditingDescription = () => {
    setDescriptionText(currentTask.description || "");
    setEditingDescription(true);
  };

  const cancelEditingDescription = () => {
    setDescriptionText("");
    setEditingDescription(false);
  };

  if (!isOpen) return null;

  const handleSendComment = async () => {
    if (!comment.trim()) return;
    try {
      await api.post("/comments", {
        taskId: currentTask._id,
        content: comment.trim()
      });
      setComment("");
      // Refresh comments list
      await fetchComments();
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "Failed to post comment";
      console.error("Error posting comment:", error);
      alert(`Error: ${message}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDateInputValue = () => {
    if (!currentTask.dueDate) return "";
    const date = new Date(currentTask.dueDate);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box w-11/24 max-w-3xl bg-base-100 p-0 overflow-hidden flex flex-col h-[600px] border border-base-300 shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-base-200 flex justify-between items-start bg-base-200/30">
          <div>
            <h3 className="text-xl font-bold">{currentTask.taskName || "Untitled Task"}</h3>
            <p className="text-sm opacity-60">in Project {currentTask.projectId?.title || "NexusFlow"}</p>
          </div>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Details Side */}
          <div className="w-1/2 p-6 overflow-y-auto border-r border-base-200">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-sm uppercase opacity-50">Description</h4>
                {!editingDescription && (
                  <button 
                    onClick={startEditingDescription}
                    className="btn btn-xs btn-outline"
                  >
                    Edit
                  </button>
                )}
              </div>
              
              {editingDescription ? (
                <div className="space-y-3">
                  <textarea
                    value={descriptionText}
                    onChange={(e) => setDescriptionText(e.target.value)}
                    placeholder="Enter task description..."
                    className="textarea textarea-bordered w-full text-sm"
                    rows={4}
                    disabled={updatingDescription}
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={handleDescriptionChange}
                      disabled={updatingDescription}
                      className="btn btn-sm btn-primary"
                    >
                      {updatingDescription ? 'Saving...' : 'Save'}
                    </button>
                    <button 
                      onClick={cancelEditingDescription}
                      disabled={updatingDescription}
                      className="btn btn-sm btn-outline"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{currentTask.description || "No description provided."}</p>
              )}
            </div>
            
            {/* Status Section */}
            <div className="mb-6">
              <h4 className="font-bold text-sm uppercase opacity-50 mb-3">Status</h4>
              <div className="flex gap-2 flex-wrap">
                <button 
                  onClick={() => handleStatusChange('todo')}
                  disabled={updatingStatus}
                  className={`btn btn-sm ${currentTask.status === 'todo' ? 'btn-info' : 'btn-outline'}`}
                >
                  {updatingStatus ? '...' : 'To Do'}
                </button>
                <button 
                  onClick={() => handleStatusChange('in-progress')}
                  disabled={updatingStatus}
                  className={`btn btn-sm ${currentTask.status === 'in-progress' ? 'btn-warning' : 'btn-outline'}`}
                >
                  {updatingStatus ? '...' : 'In Progress'}
                </button>
                <button 
                  onClick={() => handleStatusChange('completed')}
                  disabled={updatingStatus}
                  className={`btn btn-sm ${currentTask.status === 'completed' ? 'btn-success' : 'btn-outline'}`}
                >
                  {updatingStatus ? '...' : 'Done'}
                </button>
              </div>
            </div>

            {/* Deadline Section */}
            <div className="mb-6">
              <h4 className="font-bold text-sm uppercase opacity-50 mb-3">Deadline</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm badge badge-outline">{formatDate(currentTask.dueDate)}</span>
                <button 
                  onClick={() => setShowDeadlinePicker(!showDeadlinePicker)}
                  disabled={updatingDeadline}
                  className="btn btn-sm btn-outline"
                >
                  {updatingDeadline ? '...' : 'Set Date'}
                </button>
              </div>
              {showDeadlinePicker && (
                <div className="mt-3 flex gap-2">
                  <input 
                    type="date" 
                    value={getDateInputValue()}
                    onChange={(e) => handleDeadlineChange(e.target.value)}
                    className="input input-bordered input-sm flex-1"
                    disabled={updatingDeadline}
                  />
                  {currentTask.dueDate && (
                    <button
                      onClick={() => handleDeadlineChange('')}
                      disabled={updatingDeadline}
                      className="btn btn-sm btn-outline btn-error"
                    >
                      Clear
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Collaboration/Comments Side */}
          <div className="w-1/2 flex flex-col bg-base-100">
            <div className="p-4 border-b border-base-200 font-bold text-sm">Comments & Activity</div>
            
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-xs opacity-50">Loading comments...</div>
                </div>
              ) : comments.length > 0 ? (
                comments.map((c) => (
                  <div key={c._id} className="chat chat-start">
                    <div className="chat-image avatar placeholder">
                      <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                        <span className="text-xs">{c.author.name[0]}</span>
                      </div>
                    </div>
                    <div className="chat-header opacity-50 text-[10px] ml-1">
                      {c.author.name} • {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString()}
                    </div>
                    <div className="chat-bubble bg-base-200 text-base-content text-sm">{c.content}</div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full opacity-20 text-center p-4">
                  <div className="text-xs uppercase tracking-widest">No comments yet</div>
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