import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { api } from "~/lib/api";
import { SocialLogin } from "./SocialLogin";

type Role = "Team Member" | "Project Manager" | "Guest";

export function GridLayout({ modifyType }: { modifyType?: string }) {
    const navigate = useNavigate();
    const [isSignUp, setIsSignUp] = useState(false);
    const [step, setStep] = useState(1);
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "" as Role | "",
        inviteCode: "", // For Team Member/Guest
        projectName: "" // For Project Manager
    });

    const handleRoleSelection = (selectedRole: Role) => {
        setFormData({ ...formData, role: selectedRole });
        setStep(2);
    };

    const handleAuth = async () => {
        const endpoint = isSignUp ? "" : "/login"; // Backend routes: POST / (register) and POST /login
        
        try {
            console.log("Attempting Auth with:", formData);
            const { data } = await api.post(`/users${endpoint}`, formData);
            console.log("Server Response:", data);

            if (!isSignUp) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("userId", data.user._id);
                localStorage.setItem("projectCode", data.user.activeProjectCode);
                navigate("/tasks"); 
            } else {
                window.alert("Account and Project Setup Complete! Please Sign In.");
                setIsSignUp(false);
                setStep(1);
            }
        } catch (error) {
            const message = axios.isAxiosError(error)
                ? error.response?.data?.message || error.message
                : "Could not connect to the server. Is it running?";
            console.error("Auth error:", error);
            window.alert(`Error: ${message}`);
        }
    };

    if (modifyType === "home") {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] w-full mr-5 ml-5 h-auto">
                <div className="pl-3 pr-3 flex flex-col justify-center items-start ml-5 font-extralight gap-3 h-full">
                    <h1 className="text-4xl">NexusFlow</h1>
                    <p className="text-lg opacity-60">Connected to MongoDB @ 127.0.0.1</p>
                </div>

                <div className="bg-base-100 rounded-[var(--radius-box)] shadow-lg flex m-7 items-center justify-center">
                    <div className="flex flex-col justify-center items-center text-center gap-5 p-8 w-full">
                        {!isSignUp ? (
                            /* LOGIN VIEW */
                            <>
                                <h3 className="text-2xl font-bold">Sign In</h3>
                                <input type="email" placeholder="Email" className="input w-full input-bordered" 
                                    onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                <input type="password" placeholder="Password" className="input w-full input-bordered" 
                                    onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                <button className="btn btn-block btn-primary" onClick={handleAuth}>Login</button>
                                <p>or</p>
                                <button className="btn btn-block" onClick={() => setIsSignUp(true)}>Create an account</button>
                                <SocialLogin />
                            </>
                        ) : (
                            /* SIGN UP FLOW (image_4ac7a2.png) */
                            <div className="w-full flex flex-col gap-4">
                                {step === 1 ? (
                                    <>
                                        <h2 className="text-xl font-bold">Welcome to NexusFlow.</h2>
                                        <input type="text" placeholder="Enter your name" className="input w-full bg-base-200" 
                                            value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                        
                                        <h3 className="font-semibold mt-4">Choose your account type.</h3>
                                        <button className="btn btn-block bg-gray-300 text-black border-none" onClick={() => handleRoleSelection("Team Member")}>Team Member</button>
                                        <button className="btn btn-block bg-gray-300 text-black border-none" onClick={() => handleRoleSelection("Project Manager")}>Project Manager</button>
                                        <button className="btn btn-block bg-gray-300 text-black border-none" onClick={() => handleRoleSelection("Guest")}>Guest</button>
                                        <p className="text-xs opacity-50">for clients or overseers</p>
                                    </>
                                ) : (
                                    <>
                                        {formData.role === "Project Manager" ? (
                                            <>
                                                <h2 className="text-xl font-bold">Enter your first project name.</h2>
                                                <input type="text" placeholder="Project Name" className="input w-full bg-base-200"
                                                    onChange={(e) => setFormData({...formData, projectName: e.target.value})} />
                                            </>
                                        ) : (
                                            <>
                                                <h2 className="text-xl font-bold">Enter your invite code</h2>
                                                <input type="text" placeholder="Invite code" className="input w-full bg-base-200"
                                                    onChange={(e) => setFormData({...formData, inviteCode: e.target.value})} />
                                            </>
                                        )}
                                        
                                        <p className="text-sm mt-4">Finally, set your account credentials:</p>
                                        <input type="email" placeholder="Email" className="input w-full input-sm input-bordered" 
                                            onChange={(e) => setFormData({...formData, email: e.target.value})} />
                                        <input type="password" placeholder="Password" className="input w-full input-sm input-bordered" 
                                            onChange={(e) => setFormData({...formData, password: e.target.value})} />
                                        
                                        <button className="btn btn-block bg-gray-400 mt-4" onClick={handleAuth}>Enter your dashboard</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}