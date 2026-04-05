
import { Router } from "express";
import { createRecord, updateRecord, deleteRecord, getRecord } from "../controllers/recordController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMIddleware.js";

export const recordRouter = new Router()

recordRouter.post("/", authMiddleware, allowRoles('admin'), createRecord)
recordRouter.get('/', authMiddleware, getRecord)
recordRouter.put('/:id', authMiddleware, allowRoles('admin'), updateRecord)
recordRouter.delete('/:id', authMiddleware, allowRoles('admin'), deleteRecord)