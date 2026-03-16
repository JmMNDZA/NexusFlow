export function Navbar({modifyType}: {modifyType?: string}) {
    if (modifyType === "simple") {
    return (
        <div className="navbar mb-5">
            <div className="flex justify-center flex-1">
                <a className="btn btn-ghost normal-case text-xl">NexusFlow</a>
            </div>
        </div>
    );
    }
}
export default Navbar;