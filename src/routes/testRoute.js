import express from "express";
import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMIddleware.js";

export const testrouter = new Router()

testrouter.get("/admin-only",
    authMiddleware,
    allowRoles("admin","viewer"),
(req,res)=>{
    res.json({message:"welcome admin!!!"})
})

