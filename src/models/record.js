import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
    amount: {
        type: String,
        required: true
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
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    }

}, { timestamps: true })

export default mongoose.model("Record", recordSchema)