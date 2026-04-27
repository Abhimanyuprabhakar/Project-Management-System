import { useEffect, useState } from "react";
import {
    UsersIcon,
    Search,
    UserPlus,
    Shield,
    Activity,
    Trash2,
} from "lucide-react";
import InviteMemberDialog from "../components/InviteMemberDialog";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const Team = () => {
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [users, setUsers] = useState([]);

    const currentWorkspace = useSelector(
        (state) => state?.workspace?.currentWorkspace || null
    );

    const projects = currentWorkspace?.projects || [];

    useEffect(() => {
        setUsers(currentWorkspace?.members || []);

        const allTasks =
            currentWorkspace?.projects?.reduce(
                (acc, project) => [...acc, ...(project.tasks || [])],
                []
            ) || [];

        setTasks(allTasks);
    }, [currentWorkspace]);

    const filteredUsers = users.filter(
        (user) =>
            user?.user?.name
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            user?.user?.email
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
    );

    // ================= DELETE MEMBER =================
    const handleDeleteMember = async (memberId) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to remove this member?"
        );
        if (!confirmDelete) return;

        const loadingToast = toast.loading("Removing member...");

        try {
            // ===== YOUR API CALL =====
            await fetch(`/api/team/members/${memberId}`, {
                method: "DELETE",
            });

            // optimistic UI update
            setUsers((prev) => prev.filter((u) => u.id !== memberId));

            toast.success("Member removed successfully", {
                id: loadingToast,
            });
        } catch (error) {
            toast.error("Failed to remove member", {
                id: loadingToast,
            });
        }
    };

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                        Team
                    </h1>
                    <p className="text-gray-500 dark:text-zinc-400 text-sm">
                        Manage team members and their contributions
                    </p>
                </div>

                <button
                    onClick={() => setIsDialogOpen(true)}
                    className="flex items-center px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white transition"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Invite Member
                </button>

                <InviteMemberDialog
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4">
                <StatCard
                    title="Total Members"
                    value={users.length}
                    icon={<UsersIcon className="size-4 text-blue-500" />}
                    bg="bg-blue-100 dark:bg-blue-500/10"
                />

                <StatCard
                    title="Active Projects"
                    value={
                        projects.filter(
                            (p) =>
                                p.status !== "CANCELLED" &&
                                p.status !== "COMPLETED"
                        ).length
                    }
                    icon={<Activity className="size-4 text-emerald-500" />}
                    bg="bg-emerald-100 dark:bg-emerald-500/10"
                />

                <StatCard
                    title="Total Tasks"
                    value={tasks.length}
                    icon={<Shield className="size-4 text-purple-500" />}
                    bg="bg-purple-100 dark:bg-purple-500/10"
                />
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
                <input
                    placeholder="Search team members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-full text-sm rounded-md border border-gray-300 dark:border-zinc-800 py-2 focus:outline-none focus:border-blue-500"
                />
            </div>

            {/* Team Members */}
            <div className="w-full">
                {filteredUsers.length === 0 ? (
                    <div className="text-center py-16">
                        <UsersIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {users.length === 0
                                ? "No team members yet"
                                : "No members match your search"}
                        </h3>
                    </div>
                ) : (
                    <div className="max-w-4xl w-full">
                        {/* Desktop */}
                        <div className="hidden sm:block overflow-x-auto rounded-md border border-gray-200 dark:border-zinc-800">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                                <thead className="bg-gray-50 dark:bg-zinc-900/50">
                                    <tr>
                                        <th className="px-6 py-2.5 text-left text-sm">Name</th>
                                        <th className="px-6 py-2.5 text-left text-sm">Email</th>
                                        <th className="px-6 py-2.5 text-left text-sm">Role</th>
                                        <th className="px-6 py-2.5 text-left text-sm">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                            <td className="px-6 py-2.5 flex items-center gap-3">
                                                <img
                                                    src={user?.user?.image}
                                                    alt={user?.user?.name}
                                                    className="size-7 rounded-full"
                                                />
                                                <span>{user?.user?.name}</span>
                                            </td>

                                            <td className="px-6 py-2.5 text-sm text-gray-500">
                                                {user?.user?.email}
                                            </td>

                                            <td className="px-6 py-2.5">
                                                <span className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-zinc-700">
                                                    {user.role}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2.5">
                                                <button
                                                    onClick={() =>
                                                        handleDeleteMember(user.id)
                                                    }
                                                    className="p-2 rounded hover:bg-red-100 dark:hover:bg-red-500/20"
                                                >
                                                    <Trash2 className="size-4 text-red-500" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile */}
                        <div className="sm:hidden space-y-3">
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className="p-4 border rounded-md dark:border-zinc-800"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={user?.user?.image}
                                            className="size-9 rounded-full"
                                        />
                                        <div>
                                            <p>{user?.user?.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {user?.user?.email}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() =>
                                            handleDeleteMember(user.id)
                                        }
                                        className="mt-3 text-sm text-red-500 flex items-center gap-2"
                                    >
                                        <Trash2 className="size-4" />
                                        Remove Member
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Team;

// ================= SMALL REUSABLE CARD =================
const StatCard = ({ title, value, icon, bg }) => (
    <div className="max-sm:w-full border border-gray-300 dark:border-zinc-800 rounded-lg p-6 dark:bg-gradient-to-br dark:from-zinc-800/70 dark:to-zinc-900/50">
        <div className="flex items-center justify-between gap-8">
            <div>
                <p className="text-sm text-gray-500 dark:text-zinc-400">{title}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>{icon}</div>
        </div>
    </div>
);
