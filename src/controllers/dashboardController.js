import record from "../models/record.js";


export const Records = async (req, res) => {
    try {
        const records = record.find()
        let totalIncome = 0
        let totalExpense = 0
            ; (await records).forEach((record) => {
                if (record.type == 'income')
                    totalIncome += record.amount
                else
                    totalExpense += record.amount
            })
        res.json({
            totalIncome,
            totalExpense,
            netBalance: totalIncome - totalExpense
        });
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const getCategorySummary = async (req, res) => {
    try {
        const result = await record.aggregate([
            {
                $group: {
                    _id: "$category",
                    total: { $sum: "$amount" }
                }
            }
        ])
        res.json(result)
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
}

export const recentActivity = async (req, res) => {
    try {
        const recentActivity = await record.find()
            .sort({ createdAt: -1 })
            .limit(5)

        res.json(recentActivity)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getMonthlySummary = async (req, res) => {
    try {
        const result = await record.aggregate([
            {
                $group: {
                    _id: { $month: "$date" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $project: {
                    month: "$_id",
                    total: 1,
                    _id: 0
                }
            },
            {
                $sort: { month: 1 }
            }
        ]);

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};