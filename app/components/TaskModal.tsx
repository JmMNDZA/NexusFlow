import { useState, useEffect } from "react";
import api from "./api"; // Using your working path

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
    const [comments, setComments] = useState<Comment[]>([]);
    const [loadingComments, setLoadingComments] = useState(false);

    // 1. Feature: Fetch comments from backend when modal opens
    useEffect(() => {
        if (isOpen && task?.id) {
            const fetchComments = async () => {
                setLoadingComments(true);
                try {
                    const response = await api.get(`/tasks/${task.id}/comments`);
                    setComments(response.data);
                } catch (error) {
                    console.error("Could not load comments");
                    setComments([]); // Fallback to empty
                } finally {
                    setLoadingComments(false);
                }
            };
            fetchComments();
        }
    }, [isOpen, task?.id]);

    if (!isOpen) return null;

    // 2. Feature: Send comment to backend
    const handleSendComment = async () => {
        if (!comment.trim()) return;
        
        try {
            const response = await api.post(`/tasks/${task.id}/comments`, {
                text: comment
            });
            
            // Add the new comment returned from backend to the list
            setComments([...comments, response.data]);
            setComment("");
        } catch (error) {
            console.error("Failed to post comment");
        }
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box w-11/12 max-w-3xl bg-base-100 p-0 overflow-hidden flex flex-col h-[600px]">
                {/* Header */}
                <div className="p-6 border-b border-base-200 flex justify-between items-start bg-base-200/30">
                    <div>
                        <h3 className="text-xl font-bold">{task.title}</h3>
                        <p className="text-sm opacity-60">in Project NexusFlow</p>
                    </div>
                    <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    {/* Details Side */}
                    <div className="w-1/2 p-6 overflow-y-auto border-r border-base-200">
                        <h4 className="font-bold text-sm uppercase opacity-50 mb-4">Description</h4>
                        <p className="text-sm mb-6">{task.description}</p>
                        
                        <h4 className="font-bold text-sm uppercase opacity-50 mb-2">Attachments</h4>
                        <div className="border-2 border-dashed border-base-300 rounded-lg p-4 text-center text-xs opacity-50">
                            Drop files here or click to upload
                        </div>
                    </div>

                    {/* Collaboration/Comments Side */}
                    <div className="w-1/2 flex flex-col bg-base-100">
                        <div className="p-4 border-b border-base-200 font-bold text-sm">Comments & Activity</div>
                        
                        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
                            {loadingComments ? (
                                <div className="flex justify-center py-4">
                                    <span className="loading loading-spinner loading-sm"></span>
                                </div>
                            ) : comments.length === 0 ? (
                                <p className="text-center text-xs opacity-40 mt-10">No comments yet. Start the conversation!</p>
                            ) : (
                                comments.map((c) => (
                                    <div key={c.id} className="chat chat-start">
                                        <div className="chat-image avatar placeholder">
                                            <div className="bg-neutral text-neutral-content rounded-full w-8 h-8">
                                                <span className="text-xs">{c.user?.[0] || 'U'}</span>
                                            </div>
                                        </div>
                                        <div className="chat-header opacity-50 text-[10px] ml-1">
                                            {c.user} • {c.timestamp}
                                        </div>
                                        <div className="chat-bubble bg-base-200 text-base-content text-sm">{c.text}</div>
                                    </div>
                                ))
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