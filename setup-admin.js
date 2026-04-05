import mongoose from "mongoose";
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/user.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.Mongo_URI);
        console.log("MongoDB connected!");

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: "admin@promanager.com" });
        if (existingAdmin) {
            console.log("Admin user already exists!");
            process.exit(0);
        }

        // Create admin user
        const hashedPassword = await bcrypt.hash("ProManager@123", 10);

        const admin = await User.create({
            name: "Admin",
            email: "admin@promanager.com",
            password: hashedPassword,
            role: "admin",
            isActive: true,
            isVerified: true, // Admin is pre-verified
            verificationToken: null,
            verificationTokenExpiry: null
        });

        console.log("✓ Admin user created successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("Admin Credentials:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Email: admin@promanager.com`);
        console.log(`Password: ProManager@123`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\nAdmin user setup completed!");

        process.exit(0);
    } catch (error) {
        console.error("Error setting up admin:", error);
        process.exit(1);
    }
};

createAdminUser();
