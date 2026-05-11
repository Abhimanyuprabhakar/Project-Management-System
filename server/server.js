import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { inngest, functions } from './inngest/index.js';
import { serve } from "inngest/express";
import workspaceRouter from "./routes/workspaceRoutes.js";
import projectRouter from "./routes/projectRoutes.js";
import taskRouter from "./routes/taskRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import { protect } from './middlewares/authMiddleware.js';

const app = express();

app.use(express.json());
app.use(cors());

// Root route - this confirms your server is alive
app.get('/', (req, res) => {
    res.status(200).send('ManageX Server is Live and Running!');
});

// Inngest Webhook route
app.use("/api/inngest", serve({ client: inngest, functions }));

// Routes
app.use("/api/workspaces", protect, workspaceRouter);
app.use("/api/projects", protect, projectRouter);
app.use("/api/tasks", protect, taskRouter);
app.use("/api/comments", protect, commentRouter);

// Local development only: Vercel ignores this block in production
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5005;
    app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}

// THE MOST IMPORTANT LINE: This lets Vercel run your app
export default app;