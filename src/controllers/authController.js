import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { sendVerificationEmail, sendWelcomeEmail } from '../services/emailService.js'
import crypto from 'crypto'

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
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
        const verificationToken = generateVerificationToken()
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

        const user = await User.create({
            name,
            email,
            password: hashPassword,
            role: userRole,
            isActive: true,
            isVerified: false,
            verificationToken,
            verificationTokenExpiry
        })

        // Send verification email
        const emailResult = await sendVerificationEmail(email, verificationToken, name)

        if (!emailResult.success) {
            // Email sending failed, but user was created
            console.error('Failed to send verification email:', emailResult.error)
            return res.status(201).json({
                success: true,
                message: "user created but verification email could not be sent",
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            })
        }

        return res.status(201).json({
            success: true,
            message: "user created successfully. Check your email to verify your account.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
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

export const verifyEmail = async (req, res) => {
    try {
        const { token, email } = req.query

        if (!token || !email) {
            return res.status(400).json({
                success: false,
                message: "verification token and email are required"
            })
        }

        const user = await User.findOne({ email })

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "user not found"
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: "email already verified"
            })
        }

        // Check if token matches
        if (user.verificationToken !== token) {
            return res.status(400).json({
                success: false,
                message: "invalid verification token"
            })
        }

        // Check if token has expired
        if (new Date() > user.verificationTokenExpiry) {
            return res.status(400).json({
                success: false,
                message: "verification token has expired"
            })
        }

        // Mark email as verified
        user.isVerified = true
        user.verificationToken = null
        user.verificationTokenExpiry = null
        await user.save()

        // Send welcome email
        await sendWelcomeEmail(email, user.name)

        return res.json({
            success: true,
            message: "email verified successfully. You can now log in."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error verifying email",
            error: error.message
        })
    }
}