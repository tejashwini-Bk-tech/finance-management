
import { Router } from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMIddleware.js";
import {
    getRecord,
    createRecord,
    updateRecord,
    deleteRecord
} from "../controllers/recordController.js";

export const recordRouter = new Router()

recordRouter.post("/", authMiddleware, allowRoles('admin'), createRecord)
recordRouter.get('/', authMiddleware, getRecord)
recordRouter.put('/:id', authMiddleware, allowRoles('admin'), updateRecord)
recordRouter.delete('/:id', authMiddleware, allowRoles('admin'), deleteRecord)
