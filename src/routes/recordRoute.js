
import { Router } from "express";
import { createRecord, updateRecord, deleteRecord, getRecord } from "../controllers/recordCOntroller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMIddleware.js";

export const Router = new Router()

Router.post("/",authMiddleware,allowRoles('admin'),createRecord)
Router.get('/',getRecord)
Router.put('/:id',authMiddleware,allowRoles('admin'),updateRecord)
Router.delete('/:id',authMiddleware,allowRoles('admin'),deleteRecord)