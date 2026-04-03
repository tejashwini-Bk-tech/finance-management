import { Router } from "express";

import {
    getCategorySummary,
    recentActivity,
    getMonthlySummary,
    Records
} from "../controllers/dashboardController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMIddleware.js";

export const dashboardRouter = new Router()

dashboardRouter.get('/category',authMiddleware,allowRoles('admin','analyst'),getCategorySummary)
dashboardRouter.get('/summary',authMiddleware,allowRoles('admin','analyst'),Records)
dashboardRouter.get('/recent',authMiddleware,allowRoles('admin','analyst'),recentActivity)
dashboardRouter.get('/montly',authMiddleware,allowRoles('admin','analyst'),getMonthlySummary)

