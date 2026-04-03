import { Router } from "express";
import {
    getAllUsers,
    getUserById,
    updateUserRole,
    updateUserStatus,
    deleteUser
} from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMIddleware.js";

export const userRouter = new Router()

// All routes require authentication and admin role
userRouter.get("/",
    authMiddleware,
    allowRoles('admin'),
    getAllUsers
)

userRouter.get("/:id",
    authMiddleware,
    allowRoles('admin'),
    getUserById
)

userRouter.put("/:id/role",
    authMiddleware,
    allowRoles('admin'),
    updateUserRole
)

userRouter.put("/:id/status",
    authMiddleware,
    allowRoles('admin'),
    updateUserStatus
)

userRouter.delete("/:id",
    authMiddleware,
    allowRoles('admin'),
    deleteUser
)
