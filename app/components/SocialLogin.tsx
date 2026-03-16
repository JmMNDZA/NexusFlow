import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";

export function SocialLogin() {
    return (
        <div className="flex gap-3 justify-center">
            <button className="btn btn-circle btn-outline">
                <FaGoogle size={18} />
            </button>
            <button className="btn btn-circle btn-outline">
                <FaGithub size={18} />
            </button>
            <button className="btn btn-circle btn-outline">
                <FaFacebook size={18} />
            </button>
        </div>
    );
}

export default SocialLogin;