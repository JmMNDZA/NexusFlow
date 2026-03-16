import { SocialLogin } from "./SocialLogin"

export function GridLayoutHome() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] px-4 w-full mb-5 md:h-[60vh]">
            {/* NexusFlow HomePage Hero something */}
            <div className="">
                <div className="flex flex-col justify-center items-start flex-wrap p-10 text-4xl font-extralight gap-3 h-full">
                    <h1>NexusFlow Headline Message.</h1>
                    <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium</p>
                </div>
            </div>
            {/* Sign In Layout */}
            <div className="bg-base-100 rounded-[var(--radius-box)] m-4 md:m-10 shadow-lg flex items-center justify-center md:h-full">
                <div className="flex flex-col justify-center items-center text-center gap-5 p-6 w-full">
                    <h3>Sign In</h3>
                    <input type="text" placeholder="Email" className="input w-full" />
                    <input type="password" placeholder="Password" className="input w-full" />
                    <div className="flex w-full justify-center items-center flex-col gap-2">
                        <button className="btn btn-block btn-primary">Login</button>
                        <p>or</p>
                        <button className="btn btn-block">Create an account</button>
                    </div>
                    <SocialLogin />
                </div>
            </div>
        </div>
    );
}