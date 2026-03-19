import { useState } from "react";
import { SocialLogin } from "./SocialLogin";

export function GridLayout({ modifyType }: { modifyType?: string }) {
    const [isSignUp, setIsSignUp] = useState(false);
    if (modifyType === "home") {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] w-full mr-5 ml-5 h-auto">
                {/* NexusFlow HomePage Hero */}
                <div className="pl-3 pr-3">
                    <div className="flex flex-col justify-center items-start ml-5 flex-wrap sm:text-sm md:text-2xl lg:text-4xl font-extralight gap-3 h-full">
                        <h1>NexusFlow Headline Message.</h1>
                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium</p>
                    </div>
                </div>

                {/* Auth Card */}
                <div className="bg-base-100 rounded-[var(--radius-box)] shadow-lg flex m-7 items-center justify-center md:h-full">
                    <div className="flex flex-col justify-center items-center text-center gap-5 p-6 w-full">
                        {isSignUp ? (
                            <>
                                <h3>Create Account</h3>
                                <input type="text" placeholder="Name" className="input w-full" />
                                <input type="text" placeholder="Email" className="input w-full" />
                                <input type="password" placeholder="Password" className="input w-full" />
                                <input type="password" placeholder="Confirm Password" className="input w-full" />
                                <button className="btn btn-block btn-primary">Sign Up</button>
                                <p>
                                    Already have an account?{" "}
                                    <button className="link link-primary" onClick={() => setIsSignUp(false)}>
                                        Sign In
                                    </button>
                                </p>
                            </>
                        ) : (
                            <>
                                <h3>Sign In</h3>
                                <input type="text" placeholder="Email" className="input w-full" />
                                <input type="password" placeholder="Password" className="input w-full" />
                                <div className="flex w-full justify-center items-center flex-col gap-2">
                                    <button className="btn btn-block btn-primary">Login</button>
                                    <p>or</p>
                                    <button className="btn btn-block" onClick={() => setIsSignUp(true)}>
                                        Create an account
                                    </button>
                                </div>
                                <SocialLogin />
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

export default GridLayout;