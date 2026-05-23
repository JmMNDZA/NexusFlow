import { Link, useNavigate } from "react-router";

import { useState, useEffect } from "react";

import { api } from "~/lib/api";

interface User {

    _id: string;

    name: string;

    email: string;

    role: string;

    activeProjectCode: string;

}

export function Navbar({modifyType}: {modifyType?: string}) {

    const [user, setUser] = useState<User | null>(null);

    const navigate = useNavigate();

    useEffect(() => {

        const fetchUserProfile = async () => {

            try {

                const response = await api.get('/users/profile');

                setUser(response.data);

            } catch (error) {

                console.error('Failed to fetch user profile:', error);

            }

        };

        if (modifyType === "project") {

            fetchUserProfile();

        }

    }, [modifyType]);

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("userId");

        localStorage.removeItem("projectCode");

        navigate("/");

    };

    const getRoleDisplayName = (role: string) => {

        switch (role) {

            case 'Project Manager':

                return 'Project Manager';

            case 'Team Member':

                return 'Team Member';

            case 'Admin':

                return 'Administrator';

            case 'Guest':

                return 'Guest';

            default:

                return role;

        }

    };

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

<ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
    {user && (
        <>
            <div className="px-4 py-3">
                <p className="text-sm font-bold text-base-content leading-none">
                    {user.name}
                </p>
                <p className="text-xs font-medium text-base-content/60 mt-1">
                    {getRoleDisplayName(user.role)}
                </p>
            </div>
            <div className="h-px bg-base-300 my-1 mx-2" /> {/* Custom clean divider */}
        </>
    )}
    <li>
        <button 
            onClick={handleLogout} 
            className="text-error active:bg-error active:text-error-content"
        >
            Logout
        </button>
    </li>
</ul>

                    </div>

                </div>

            </div>

        );

    }

    

    return null;

}

export default Navbar;

