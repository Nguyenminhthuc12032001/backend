const orderItemModel = require('../models/orderItem.model');

const createNew = async (req, res) => {
    try {
        const { order_id, product_id, quantity, price_each } = req.body;

        const newOrderItem = new orderItemModel({
            order_id,
            product_id,
            quantity,
            price_each
        });

        await newOrderItem.save();
        return res.status(201).json({ msg: 'Order item created successfully', orderItem: newOrderItem });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const orderItems = await orderItemModel.find()
            .populate('order_id', 'status total_amount')
            .populate('product_id', 'name price');
        return res.status(200).json({ orderItems });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const orderItem = await orderItemModel.findById(req.params.id)
            .populate('order_id', 'status total_amount')
            .populate('product_id', 'name price');
        if (!orderItem) {
            return res.status(404).json({ msg: 'Order item not found' });
        }
        return res.status(200).json({ orderItem });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const orderItem = await orderItemModel.findById(req.params.id);
        if (!orderItem) {
            return res.status(404).json({ msg: 'Order item not found' });
        }

        const { quantity, price_each } = req.body;
        orderItem.quantity = quantity ?? orderItem.quantity;
        orderItem.price_each = price_each ?? orderItem.price_each;

        await orderItem.save();
        return res.status(200).json({ msg: 'Order item updated successfully', orderItem });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await orderItemModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Order item not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'Order item deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.order) {
            query.order_id = req.query.order;
        }
        if (req.query.product) {
            query.product_id = req.query.product;
        }

        const orderItems = await orderItemModel.find(query)
            .populate('order_id', 'status total_amount')
            .populate('product_id', 'name price');
        return res.status(200).json({ orderItems });
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
