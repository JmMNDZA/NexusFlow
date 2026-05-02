import { Link } from "react-router";

export function Navbar({modifyType}: {modifyType?: string}) {
    if (modifyType === "simple") {
        return (
            <div className="navbar mb-2">
                <div className="flex justify-center flex-1">
                    <a className="btn btn-ghost normal-case text-xl">NexusFlow</a>
                </div>
            </div>
        );
    }
    
    if (modifyType === "project") {
        return (
            <div className="navbar bg-base-100 shadow-sm">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost normal-case text-xl font-bold">
                        NexusFlow
                    </Link>
                </div>
                <div className="flex-none gap-2">
                    {/* User Avatar */}
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-neutral">
                                <div className="flex items-center justify-center h-full text-neutral-content">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                            <li><a>Profile</a></li>
                            <li><a>Settings</a></li>
                            <li><a>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        );
    }
    
    return null;
}

export default Navbar;