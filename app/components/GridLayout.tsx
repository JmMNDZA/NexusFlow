import { useState } from "react";
import { SocialLogin } from "./SocialLogin";
import api from "./api"; // Centralized API config

export function GridLayout({ modifyType }: { modifyType?: string }) {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false); // Feature: Loading state

    // 1. State Management for Forms
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // 2. Asynchronous Request Handling (Login)
    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await api.post('/login', {
                email: formData.email,
                password: formData.password
            });
            console.log("Login Success:", response.data);
            // Handle success (e.g., redirect or save token)
        } catch (error: any) {
            // 3. Error Catching
            alert(error.response?.data?.message || "Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    // 2. Asynchronous Request Handling (Register)
    const handleSignUp = async () => {
        setLoading(true);
        try {
            const response = await api.post('/register', formData);
            console.log("Registration Success:", response.data);
            setIsSignUp(false); 
        } catch (error: any) {
            // 3. Error Catching
            alert(error.response?.data?.message || "Sign up failed.");
        } finally {
            setLoading(false);
        }
    };

    if (modifyType === "home") {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] w-full mr-5 ml-5 h-auto">
                <div className="pl-3 pr-3">
                    <div className="flex flex-col justify-center items-start ml-5 flex-wrap sm:text-sm md:text-2xl lg:text-4xl font-extralight gap-3 h-full">
                        <h1>NexusFlow Headline Message.</h1>
                        <p>Welcome to your integrated project manager.</p>
                    </div>
                </div>

                <div className="bg-base-100 rounded-[var(--radius-box)] shadow-lg flex m-7 items-center justify-center md:h-full">
                    <div className="flex flex-col justify-center items-center text-center gap-5 p-6 w-full">
                        {isSignUp ? (
                            <>
                                <h3>Create Account</h3>
                                <input name="name" type="text" placeholder="Name" className="input w-full" onChange={handleChange} />
                                <input name="email" type="text" placeholder="Email" className="input w-full" onChange={handleChange} />
                                <input name="password" type="password" placeholder="Password" className="input w-full" onChange={handleChange} />
                                <input name="password_confirmation" type="password" placeholder="Confirm Password" className="input w-full" onChange={handleChange} />
                                <button 
                                    className={`btn btn-block btn-primary ${loading ? 'loading' : ''}`} 
                                    onClick={handleSignUp}
                                    disabled={loading}
                                >
                                    {loading ? 'Processing...' : 'Sign Up'}
                                </button>
                                <p>
                                    Already have an account?{" "}
                                    <button className="link link-primary" onClick={() => setIsSignUp(false)}>Sign In</button>
                                </p>
                            </>
                        ) : (
                            <>
                                <h3>Sign In</h3>
                                <input name="email" type="text" placeholder="Email" className="input w-full" onChange={handleChange} />
                                <input name="password" type="password" placeholder="Password" className="input w-full" onChange={handleChange} />
                                <div className="flex w-full justify-center items-center flex-col gap-2">
                                    <button 
                                        className={`btn btn-block btn-primary ${loading ? 'loading' : ''}`} 
                                        onClick={handleLogin}
                                        disabled={loading}
                                    >
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                    <p>or</p>
                                    <button className="btn btn-block" onClick={() => setIsSignUp(true)}>Create an account</button>
                                </div>
                                <SocialLogin />
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
    return null;
}