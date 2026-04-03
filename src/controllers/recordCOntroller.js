import Record from '../models/record.js'

export const createRecord = async (req, res) => {
    try {
        const { amount, type, category, date, notes } = req.body
        if (!amount || !type || !category)
            return res.status(401).json({ message: "amount,type,atogory are required" })

        const record = await Record.create({
            amount,
            type,
            category,
            date,
            notes,
            createdBy: req.user.id
        })

        return res.status(201).json(record)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export const getRecord = async (req, res) => {
    try {
        const { type, category, startDate, endDate } = req.body
        let filter = {}
        if (type)
            filter.type = type;
        if (category)
            filter.category = category;
        if (startDate && endDate) {
            filter.date = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const records = await Record.find(filter);

        res.json(records);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateRecord = async (req, res) => {
    try {
        const record = Record.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        )
        if (!record)
            res.status(404).json({ message: "Record does not exist" })
        
        if (record.createdBy.toString() !== req.user.id)
            return res.status(403).json({ message: "Not allowed" });
        res.json(record)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteRecord = async (req, res) => {
    try {
        const record = Record.findByIdAndDelete(req.params.id)
        if (!record)
            res.status(404).json({ message: "Record does not exist" })
        res.json({ message: "record is deleted" })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}