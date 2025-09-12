const { default: mongoose } = require('mongoose');
const orderModel = require('../models/order.model');
const orderItemModel = require('../models/order_item.model');
const productModel = require('../models/product.model');

const createOrder = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { user_id, total_amount, items } = req.body;
        const newOrder = new orderModel({ user_id, total_amount, status: "ordered" });
        await newOrder.save({ session })

        const orderItems = items.map(item => ({
            order_id: newOrder._id,
            product_id: item.product_id,
            quantity: item.quantity,
            price_each: item.price_each
        }));
        await orderItemModel.insertMany(orderItems);
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({ msg: 'Order created successfully', order: newOrder });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const orders = await orderModel.find({ isDeleted: false }).populate('user_id', 'name email');
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.id, isDeleted: false }).populate('user_id', 'name email');
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        return res.status(200).json({ order });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const addItems = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { user_id, product_id, quantity } = req.body;
        const product = await productModel.findOne({ _id: product_id, isDeleted: false }).session(session);
        if (!product) {
            await session.abortTransaction();
            await session.endSession();
            return res.status(404).json({ msg: "Product not found. Cannot add to cart." })
        }
        let cart = await orderModel.findOne({ user_id, status: 'cart' }).session(session);
        if (!cart) {
            cart = new orderModel({ user_id, total_amount: 0 });
            await cart.save({ session });
        }
        let orderItem = await orderItemModel.findOne({ order_id: cart._id, product_id, isDelete: false }).session(session);
        if (!orderItem) {
            if (quantity > 0) {
                orderItem = new orderItemModel({ order_id: cart._id, product_id, quantity });
                await orderItem.save({ session });
            }
            else {
                await session.abortTransaction();
                await session.endSession();
                return res.status(400).json({ msg: "Cannot reduce non-existing item" })
            }
        }
        const newQuantity = orderItem.quantity + quantity;
        if (newQuantity <= 0) {
            cart.total_amount -= product.price * orderItem.quantity
            await orderItem.updateOne({ isDelete: true }, { session })
        }
        else {
            orderItem.quantity = newQuantity;
            cart.total_amount += product.price * quantity;
        }
        await orderItem.save({ session });
        await cart.save({ session });

        await session.commitTransaction();
        await session.endSession()
        return res.status(200).json({ msg: 'Added to cart successfully.' });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const { order_id, status } = req.body;
        const order = await orderModel.findOne({ _id: order_id, isDeleted: false });

        if (!order) {
            return res.status(404).json({ msg: "Order not found." })
        }

        if (status === "cart") {
            return res.status(400).json({ msg: "Cannot update user's cart directly." })
        }

        if (!["complete", "cancelled"].includes(status)) {
            return res.status(400).json({ msg: "Invalid status. Must be one of: complete, cancelled." })
        }

        order.status = status;
        await order.save();
        return res.status(200).json({ msg: "Order updated successfully.", order })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const remove = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const order = await orderModel.findOneAndUpdate({ _id: req.params.id }, { isDeleted: true }, { session });
        if (!order) {
            session.abortTransaction();
            session.endSession();
            return res.status(404).json({ msg: 'Order not found, unable to delete' });
        }
        await orderItemModel.updateMany({ order_id: order._id, isDeleted: false }, { isDeleted: true }, { session });
        await session.commitTransaction();
        await session.endSession();
        return res.status(200).json({ msg: 'Order deleted successfully' });
    } catch (error) {
        await session.abortTransaction();
        await session.endSession();
        return res.status(500).json({ error: error.message });
    }
};

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.status) {
            query.status = req.query.status;
        }
        query.total_amount = {}
        if (req.query.min_total_amount) {
            query.total_amount.$gte = Number(req.query.min_total_amount);
        }
        if (req.query.max_total_amount) {
            query.total_amount.$lte = Number(req.query.max_total_amount);
        }

        const orders = await orderModel.find({ ...query, isDeleted: false }).populate('user_id', 'name email');
        return res.status(200).json({ orders });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const totalItems = async (req, res) => {
    try {
        const user_id = req.params.user_id;
        const order = await orderModel.findOne({ user_id, status: "cart", isDeleted: false });
        if (!order) return res.status(200).json({ total_items: 0 });
        const total_items = (await orderItemModel.find({ order_id: order._id, isDelete: false })).length;
        return res.status(200).json({ total_items })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createOrder,
    getAll,
    get,
    addItems,
    update,
    remove,
    search,
    totalItems
};
