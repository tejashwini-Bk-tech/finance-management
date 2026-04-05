import Record from '../models/record.js'

// Helper function for building filters
const buildRecordFilter = (userId, query) => {
    let filter = { createdBy: userId, isDeleted: false }

    if (query.type) {
        if (!["income", "expenses"].includes(query.type)) {
            throw new Error("type must be either 'income' or 'expenses'")
        }
        filter.type = query.type
    }

    if (query.category) {
        filter.category = new RegExp(query.category, 'i')  // Case-insensitive search
    }

    if (query.search) {
        filter.$or = [
            { category: new RegExp(query.search, 'i') },
            { notes: new RegExp(query.search, 'i') }
        ]
    }

    if (query.startDate && query.endDate) {
        if (isNaN(new Date(query.startDate).getTime()) || isNaN(new Date(query.endDate).getTime())) {
            throw new Error("invalid date format")
        }
        filter.date = {
            $gte: new Date(query.startDate),
            $lte: new Date(query.endDate)
        }
    }

    return filter
}

export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body

        // Input validation
        if (!amount || !type || !category) {
            return res.status(400).json({
                success: false,
                message: "amount, type, and category are required",
                fields: ["amount", "type", "category"]
            })
        }

        if (amount < 0) {
            return res.status(400).json({
                success: false,
                message: "amount must be greater than or equal to 0"
            })
        }

        if (!["income", "expenses"].includes(type)) {
            return res.status(400).json({
                success: false,
                message: "type must be either 'income' or 'expenses'"
            })
        }

        if (date && isNaN(new Date(date).getTime())) {
            return res.status(400).json({
                success: false,
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
        const page = Math.max(1, parseInt(req.query.page) || 1)
        const limit = Math.min(100, parseInt(req.query.limit) || 10)
        const skip = (page - 1) * limit
        const sortField = req.query.sort || 'date'
        const sortOrder = sortField.startsWith('-') ? -1 : 1
        const actualSortField = sortField.startsWith('-') ? sortField.substring(1) : sortField

        const filter = buildRecordFilter(req.user.id, req.query)

        const records = await Record.find(filter)
            .sort({ [actualSortField]: sortOrder })
            .skip(skip)
            .limit(limit)

        const total = await Record.countDocuments(filter)
        const totalPages = Math.ceil(total / limit)

        return res.json({
            success: true,
            count: records.length,
            total,
            page,
            limit,
            totalPages,
            data: records
        })

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

        if (!record || record.isDeleted) {
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
                success: false,
                message: "amount must be greater than or equal to 0"
            })
        }

        if (req.body.type && !["income", "expenses"].includes(req.body.type)) {
            return res.status(400).json({
                success: false,
                message: "type must be either 'income' or 'expenses'"
            })
        }

        if (req.body.date && isNaN(new Date(req.body.date).getTime())) {
            return res.status(400).json({
                success: false,
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

        if (!record || record.isDeleted) {
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

        // Soft delete - mark as deleted instead of removing
        await Record.findByIdAndUpdate(req.params.id, { isDeleted: true })

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

