import prisma from "../configs/prisma.js";

// Get all workspaces for user
export const getUserWorkspaces = async (req, res) => {
    try {

        const { userId } = await req.auth();
        const workspaces = await prisma.workspace.findMany({
            where: {
                members: { some: { userId: userId } }
            },
            include: {
                members: { include: { user: true } },
                projects: {
                    include: {
                        tasks: { include: { assignee: true, comments: { include: { user: true } } } },
                        members: { include: { user: true } }
                    }
                },
                owner: true
            }
        });
        res.json({ workspaces });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};

// Create a new workspace
export const createWorkspace = async (req, res) => {
    try {
        const { userId } = await req.auth();
        const { name, description, image_url } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Workspace name is required" });
        }

        // Generate a unique slug from the name
        const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") + "-" + Date.now();

        const workspace = await prisma.workspace.create({
            data: {
                id: `ws_${Date.now()}`,
                name,
                slug,
                description: description || "",
                image_url: image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                ownerId: userId,
                members: {
                    create: {
                        userId,
                        role: "ADMIN",
                    }
                }
            },
            include: {
                members: { include: { user: true } },
                projects: {
                    include: {
                        tasks: { include: { assignee: true, comments: { include: { user: true } } } },
                        members: { include: { user: true } }
                    }
                },
                owner: true
            }
        });

        res.json({ workspace, message: "Workspace created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.code || error.message });
    }
};