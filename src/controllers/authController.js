import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        // Input validation
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "name, email, and password are required"
            })
        }

        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "invalid email format"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "password must be at least 6 characters"
            })
        }

        // Validate role - only analyst and viewer can self-register
        const validRoles = ["analyst", "viewer"]
        const userRole = role || "viewer" // Default to viewer

        if (!validRoles.includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: "role must be 'analyst' or 'viewer'. Admin role is not available for self-registration."
            })
        }

        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(409).json({
                success: false,
                message: "email already registered"
            })
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: userRole,
            isActive: true
        })

        return res.status(201).json({
            success: true,
            message: "user created successfully",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error creating user",
            error: error.message
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        // Input validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "email and password are required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password"
            })
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "user account is inactive"
            })
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "please verify your email before logging in"
            })
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "invalid email or password"
            })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        return res.json({
            success: true,
            message: "login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error during login",
            error: error.message
        })
    }
}