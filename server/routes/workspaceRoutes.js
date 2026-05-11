import express from "express";
import { getUserWorkspaces, createWorkspace } from "../controllers/workspaceController.js";

const workspaceRouter = express.Router();

workspaceRouter.get("/", getUserWorkspaces);
workspaceRouter.post("/", createWorkspace);

export default workspaceRouter;