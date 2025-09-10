const orderModel = require('../models/order.model');

const createNew = async (req, res) => {
    try {
        const { owner_id, total_amount, status } = req.body;
        const newOrder = new orderModel({ owner_id, total_amount, status });
        await newOrder.save();
        return res.status(201).json({ msg: 'Order created successfully', order: newOrder });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const orders = await orderModel.find().populate('owner_id', 'name email');
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id).populate('owner_id', 'name email');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const order = await orderModel.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }

        const { total_amount, status } = req.body;

        order.total_amount = total_amount ?? order.total_amount;
        order.status = status || order.status;

        await order.save();
        return res.status(200).json({ msg: 'Order updated successfully', order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await orderModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Order not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'Order deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.owner) {
            query.owner_id = req.query.owner;
        }

        const orders = await orderModel.find(query).populate('owner_id', 'name email');
        return res.status(200).json({ orders });
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
