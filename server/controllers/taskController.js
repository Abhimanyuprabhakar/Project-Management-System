import prisma from "../configs/prisma.js";
import { inngest } from "../inngest/index.js";

// Create task
export const createTask = async (req, res) => {
    try {

        const { userId } = await req.auth();
        const { projectId, title, description, type, status, priority, assigneeId, due_date } = req.body;
        const origin =
          req.get("origin") ||
          process.env.APP_URL ||
          "http://localhost:5173";

        // Check if user has admin role for project
        const project = await prisma.project.findUnique({
            where: { id: projectId },
            include: { members: { include: { user: true } } },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        else if (project.team_lead !== userId) {
            return res.status(403).json({ message: "You don't have admin privileges for this project" });
        }
        else if (assigneeId && !project.members.find((member) => member.user.id === assigneeId)) {
            return res.status(403).json({ message: "assignee is not a member of the project / workspace" });
        }

        if (!due_date) {
            return res.status(400).json({ message: "Due date is required" });
        }

        const task = await prisma.task.create({
            data: {
                projectId,
                title,
                description,
                type,
                priority,
                assigneeId,
                status,
                due_date: new Date(due_date),
            }
        });

        const taskWithAssignee = await prisma.task.findUnique({
            where: { id: task.id },
            include: { assignee: true },
        });

        // Fire-and-forget: don't let Inngest errors (e.g. 401 in local dev) fail task creation
        inngest.send({
            name: "app/task.assigned",
            data: { taskId: task.id, origin }
        }).catch((err) => {
            console.warn("[Inngest] Event send skipped (local dev):", err?.message || err);
        });

        res.json({ task: taskWithAssignee, message: "Task created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};


// Update task
export const updateTask = async (req, res) => {
    try {

        const task = await prisma.task.findUnique({
            where: { id: req.params.id },
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const { userId } = await req.auth();

        const project = await prisma.project.findUnique({
            where: { id: task.projectId },
            include: { members: { include: { user: true } } },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        } else if (project.team_lead !== userId) {
            return res.status(403).json({ message: "You don't have admin privileges for this project" });
        }

        const updatedTask = await prisma.task.update({
            where: { id: req.params.id },
            data: req.body,
        });

        // Auto-update project progress and status based on task completion
        const allTasks = await prisma.task.findMany({ where: { projectId: task.projectId } });
        const doneTasks = allTasks.filter((t) => t.status === "DONE").length;
        const progress = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0;
        const autoStatus = progress === 100 ? "COMPLETED" : (project.status === "COMPLETED" ? "ACTIVE" : project.status);

        await prisma.project.update({
            where: { id: task.projectId },
            data: { progress, status: autoStatus },
        });

        res.json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Delete task
export const deleteTask = async (req, res) => {
    try {

        const { userId } = await req.auth();
        const { tasksIds } = req.body;

        const tasks = await prisma.task.findMany({
            where: { id: { in: tasksIds } },
        });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "Task not found" });
        }

        const project = await prisma.project.findUnique({
            where: { id: tasks[0].projectId },
            include: { members: { include: { user: true } } },
        });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        } else if (project.team_lead !== userId) {
            return res.status(403).json({ message: "You don't have admin privileges for this project" });
        }

        await prisma.task.deleteMany({
            where: { id: { in: tasksIds } },
        });

        res.json({ message: "Task deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};