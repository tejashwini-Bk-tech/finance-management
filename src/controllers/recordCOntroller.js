import Record from '../models/record.js'

export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body

        // Input validation
        if (!amount || !type || !category) {
            return res.status(400).json({
                message: "amount, type, and category are required",
                fields: ["amount", "type", "category"]
            })
        }

        if (amount < 0) {
            return res.status(400).json({
                message: "amount must be greater than or equal to 0"
            })
        }

        if (!["income", "expenses"].includes(type)) {
            return res.status(400).json({
                message: "type must be either 'income' or 'expenses'"
            })
        }

        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({
                message: "invalid date format"
            })
        }

        const record = await Record.create({
            amount,
            type,
            category,
            date: date || new Date(),
            notes: notes || "",
            createdBy: req.user.id
        })

        return res.status(201).json({
            success: true,
            message: "record created successfully",
            data: record
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error creating record",
            error: error.message
        });
    }
}

export const getRecord = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.body
        let filter = {}

        if (type) {
            if (!["income", "expenses"].includes(type)) {
                return res.status(400).json({
                    message: "type must be either 'income' or 'expenses'"
                })
            }
            filter.type = type;
        }

        if (category) {
            filter.category = category;
        }

        if (startDate && endDate) {
            if (isNaN(new Date(startDate).getTime()) || isNaN(new Date(endDate).getTime())) {
                return res.status(400).json({
                    message: "invalid date format"
                })
            }
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const records = await Record.find(filter);

        return res.json({
            success: true,
            count: records.length,
            data: records
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error fetching records",
            error: error.message
        });
    }
}

export const updateRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id)

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "record not found"
            })
        }

        if (record.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "not authorized to update this record"
            });
        }

        // Validate update fields
        if (req.body.amount !== undefined && req.body.amount < 0) {
            return res.status(400).json({
                message: "amount must be greater than or equal to 0"
            })
        }

        if (req.body.type && !["income", "expenses"].includes(req.body.type)) {
            return res.status(400).json({
                message: "type must be either 'income' or 'expenses'"
            })
        }

        if (req.body.date && isNaN(new Date(req.body.date).getTime())) {
            return res.status(400).json({
                message: "invalid date format"
            })
        }

        const updatedRecord = await Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )

        return res.json({
            success: true,
            message: "record updated successfully",
            data: updatedRecord
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error updating record",
            error: error.message
        });
    }
}

export const deleteRecord = async (req, res) => {
    try {
        const record = await Record.findById(req.params.id)

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "record not found"
            })
        }

        if (record.createdBy.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "not authorized to delete this record"
            });
        }

        await Record.findByIdAndDelete(req.params.id)

        return res.json({
            success: true,
            message: "record deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "error deleting record",
            error: error.message
        });
    }
}