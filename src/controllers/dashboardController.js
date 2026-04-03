import Record from "../models/record.js";

export const Records = async (req, res) => {
    try {
        const records = await Record.find()
        let totalIncome = 0
        let totalExpense = 0

        records.forEach((record) => {
            if (record.type === 'income') {
                totalIncome += record.amount
            } else if (record.type === 'expenses') {
                totalExpense += record.amount
            }
        })

        return res.json({
            success: true,
            data: {
                totalIncome,
                totalExpense,
                netBalance: totalIncome - totalExpense
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching summary",
            error: error.message
        });
    }
}

export const getCategorySummary = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            }
        ])

        return res.json({
            success: true,
            count: result.length,
            data: result
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching category summary",
            error: error.message
        });
    }
}

export const recentActivity = async (req, res) => {
    try {
        const limit = Math.min(req.query.limit || 5, 100); // Max 100 records
        const recentActivity = await Record.find()
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate('createdBy', 'name email')

        return res.json({
            success: true,
            count: recentActivity.length,
            data: recentActivity
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching recent activity",
            error: error.message
        });
    }
}

export const getMonthlySummary = async (req, res) => {
    try {
        const result = await Record.aggregate([
            {
                $group: {
                    _id: {
                        month: { $month: "$date" },
                        year: { $year: "$date" }
                    },
                    income: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "income"] }, "$amount", 0]
                        }
                    },
                    expenses: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "expenses"] }, "$amount", 0]
                        }
                    },
                    total: { $sum: "$amount" }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        return res.json({
            success: true,
            count: result.length,
            data: result
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching monthly summary",
            error: error.message
        });
    }
}