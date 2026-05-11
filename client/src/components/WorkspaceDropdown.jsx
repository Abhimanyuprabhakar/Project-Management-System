import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Plus, X, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentWorkspace, createWorkspaceThunk } from "../features/workspaceSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function WorkspaceDropdown() {

    const { workspaces, loading } = useSelector((state) => state.workspace);
    const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
    const [isOpen, setIsOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [newWorkspaceName, setNewWorkspaceName] = useState("");
    const [newWorkspaceDesc, setNewWorkspaceDesc] = useState("");
    const dropdownRef = useRef(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSelectWorkspace = (workspaceId) => {
        dispatch(setCurrentWorkspace(workspaceId))
        setIsOpen(false);
        navigate('/')
    }

    const handleCreateWorkspace = async (e) => {
        e.preventDefault();
        if (!newWorkspaceName.trim()) return toast.error("Workspace name is required");
        try {
            await dispatch(createWorkspaceThunk({ name: newWorkspaceName.trim(), description: newWorkspaceDesc.trim() })).unwrap();
            toast.success("Workspace created!");
            setNewWorkspaceName("");
            setNewWorkspaceDesc("");
            setIsCreating(false);
            setIsOpen(false);
            navigate('/');
        } catch (err) {
            toast.error(err || "Failed to create workspace");
        }
    };

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setIsCreating(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);



    return (
        <div className="relative m-4" ref={dropdownRef}>
            <button onClick={() => setIsOpen(prev => !prev)} className="w-full flex items-center justify-between p-3 h-auto text-left rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                <div className="flex items-center gap-3">
                    <img src={currentWorkspace?.image_url} alt={currentWorkspace?.name} className="w-8 h-8 rounded shadow" />
                    <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                            {currentWorkspace?.name || "Select Workspace"}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                            {workspaces.length} workspace{workspaces.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-400 flex-shrink-0" />
            </button>

            {isOpen && (
                <div className="absolute z-50 w-64 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded shadow-lg top-full left-0">
                    {!isCreating ? (
                        <>
                            <div className="p-2">
                                <p className="text-xs text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-2 px-2">
                                    Workspaces
                                </p>
                                {workspaces.length === 0 && (
                                    <p className="text-xs text-gray-400 dark:text-zinc-500 px-2 py-1">No workspaces yet. Create one below.</p>
                                )}
                                {workspaces.map((workspace) => (
                                    <div key={workspace.id} onClick={() => onSelectWorkspace(workspace.id)} className="flex items-center gap-3 p-2 cursor-pointer rounded hover:bg-gray-100 dark:hover:bg-zinc-800" >
                                        <img src={workspace.image_url} alt={workspace.name} className="w-6 h-6 rounded" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                                                {workspace.name}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 truncate">
                                                {workspace.members?.length || 1} members
                                            </p>
                                        </div>
                                        {currentWorkspace?.id === workspace.id && (
                                            <Check className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <hr className="border-gray-200 dark:border-zinc-700" />

                            <div onClick={() => setIsCreating(true)} className="p-2 cursor-pointer rounded group hover:bg-gray-100 dark:hover:bg-zinc-800" >
                                <p className="flex items-center text-xs gap-2 my-1 w-full text-blue-600 dark:text-blue-400 group-hover:text-blue-500 dark:group-hover:text-blue-300">
                                    <Plus className="w-4 h-4" /> Create Workspace
                                </p>
                            </div>
                        </>
                    ) : (
                        <form onSubmit={handleCreateWorkspace} className="p-3 space-y-2">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-xs font-semibold text-gray-700 dark:text-zinc-300">New Workspace</p>
                                <button type="button" onClick={() => setIsCreating(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            <input
                                autoFocus
                                type="text"
                                placeholder="Workspace name *"
                                value={newWorkspaceName}
                                onChange={(e) => setNewWorkspaceName(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Description (optional)"
                                value={newWorkspaceDesc}
                                onChange={(e) => setNewWorkspaceDesc(e.target.value)}
                                className="w-full px-2 py-1.5 text-xs rounded border border-gray-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-1.5 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                                {loading ? "Creating..." : "Create"}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default WorkspaceDropdown;

