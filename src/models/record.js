import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount must be greater than or equal to 0"]
    },
    type: {
        type: String,
        enum: ["income", "expenses"],
        default: "income"
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    notes: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true })

export default mongoose.model("Record", recordSchema)