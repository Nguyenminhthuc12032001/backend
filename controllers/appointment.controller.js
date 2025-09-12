const appointmentModel = require('../models/appointment.model');

const createNew = async (req, res) => {
    try {
        const { pet_id, owner_id, vet_id, appointment_time, status } = req.body;

        const newAppointment = new appointmentModel({
            pet_id,
            owner_id,
            vet_id,
            appointment_time,
            status
        });

        //auto assign vet if not provided
        if (!vet_id) {
            const User = require('../models/user.model');
            const Vet = await User.findOne({ role: 'vet' }).sort({ appointments: 1 });
            if (!Vet) {
                return res.status(400).json({ msg: 'No vets available' });
            }
            newAppointment.vet_id = Vet._id;
        }
        await newAppointment.save();
        return res.status(201).json({ msg: 'Appointment created successfully', appointment: newAppointment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const appointments = await appointmentModel.find()
            .populate('pet_id', 'name species')
            .populate('owner_id', 'name email')
            .populate('vet_id', 'name email role');
        return res.status(200).json({ appointments });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const appointment = await appointmentModel.findById(req.params.id)
            .populate('pet_id', 'name species')
            .populate('owner_id', 'name email')
            .populate('vet_id', 'name email role');

        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }
        return res.status(200).json({ appointment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const appointment = await appointmentModel.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        const { appointment_time, status } = req.body;

        appointment.appointment_time = appointment_time || appointment.appointment_time;
        appointment.status = status || appointment.status;

        await appointment.save();
        return res.status(200).json({ msg: 'Appointment updated successfully', appointment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await appointmentModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Appointment not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'Appointment deleted successfully' });
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
        if (req.query.owner) {
            query.owner_id = req.query.owner;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }

        const appointments = await appointmentModel.find(query)
            .populate('pet_id', 'name species')
            .populate('owner_id', 'name email')
            .populate('vet_id', 'name email role');

        return res.status(200).json({ appointments });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};



const completeCase = async (req, res) => {
    try {
        const appointment = await appointmentModel.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        appointment.status = 'completed';

        await appointment.save();
        return res.status(200).json({ msg: 'Appointment marked as completed', appointment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
module.exports = {
    createNew,
    getAll,
    get,
    update,
    remove,
    search,
    completeCase
};
