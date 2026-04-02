import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import user from '../models/user.js'

export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const existUser = await User.findOne({ email })

        if (existUser) {
            return res.status(400).json({ message: "user already exists" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const user = User.create({
            name,
            email,
            password: hashPassword,
            role
        })
        res.status(200).json({ message: "user created", user })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user)
            res.status(404).json({ message: "user not found" })

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch)
            res.status(401).json({ message: "unauthorized access" })
        
        const token = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn:"1d"}
        )
        res.json({token,role:user.role})
    } catch (error) {
        res.status(500).json({ message: error })
    }
}