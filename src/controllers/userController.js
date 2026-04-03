import User from '../models/user.js'

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password')

        return res.json({
            success: true,
            count: users.length,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching users",
            error: error.message
        });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        return res.json({
            success: true,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching user",
            error: error.message
        });
    }
}

export const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body

        if (!role) {
            return res.status(400).json({
                success: false,
                message: "role is required"
            })
        }

        if (!["admin", "analyst", "viewer"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "role must be 'admin', 'analyst', or 'viewer'"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        return res.json({
            success: true,
            message: "user role updated successfully",
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error updating user role",
            error: error.message
        });
    }
}

export const updateUserStatus = async (req, res) => {
    try {
        const { isActive } = req.body

        if (typeof isActive !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: "isActive must be a boolean"
            })
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isActive },
            { new: true }
        ).select('-password')

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        const action = isActive ? "activated" : "deactivated"
        return res.json({
            success: true,
            message: `user ${action} successfully`,
            data: user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error updating user status",
            error: error.message
        });
    }
}

export const deleteUser = async (req, res) => {
    try {
        // Prevent deleting yourself
        if (req.params.id === req.user.id) {
            return res.status(400).json({
                success: false,
                message: "you cannot delete your own account"
            })
        }

        const user = await User.findByIdAndDelete(req.params.id)

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        return res.json({
            success: true,
            message: "user deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error deleting user",
            error: error.message
        });
    }
}
