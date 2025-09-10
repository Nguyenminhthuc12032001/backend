const healthRecordModel = require('../models/healthRecord.model');

const createNew = async (req, res) => {
    try {
        const { pet_id, vet_id, visit_date, diagnosis, treatment } = req.body;

        const newRecord = new healthRecordModel({
            pet_id,
            vet_id,
            visit_date,
            diagnosis,
            treatment
        });

        await newRecord.save();
        return res.status(201).json({ msg: 'Health record created successfully', record: newRecord });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const records = await healthRecordModel.find()
            .populate('pet_id', 'name species')
            .populate('vet_id', 'name email role');
        return res.status(200).json({ records });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const record = await healthRecordModel.findById(req.params.id)
            .populate('pet_id', 'name species')
            .populate('vet_id', 'name email role');

        if (!record) {
            return res.status(404).json({ msg: 'Health record not found' });
        }
        return res.status(200).json({ record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const record = await healthRecordModel.findById(req.params.id);
        if (!record) {
            return res.status(404).json({ msg: 'Health record not found' });
        }

        const { visit_date, diagnosis, treatment } = req.body;

        record.visit_date = visit_date || record.visit_date;
        record.diagnosis = diagnosis || record.diagnosis;
        record.treatment = treatment || record.treatment;

        await record.save();
        return res.status(200).json({ msg: 'Health record updated successfully', record });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await healthRecordModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Health record not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'Health record deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.pet) {
            query.pet_id = req.query.pet;
        }
        if (req.query.vet) {
            query.vet_id = req.query.vet;
        }
        if (req.query.diagnosis) {
            query.diagnosis = { $regex: req.query.diagnosis, $options: 'i' };
        }

        const records = await healthRecordModel.find(query)
            .populate('pet_id', 'name species')
            .populate('vet_id', 'name email role');
        return res.status(200).json({ records });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createNew,
    getAll,
    get,
    update,
    remove,
    search
};
