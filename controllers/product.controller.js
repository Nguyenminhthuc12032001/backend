const productModel = require('../models/product.model');
const deleteImage = require('../utils/deleteImage');

const createNew = async (req, res) => {
    try {
        const { name, category, price, description, stock_quantity, images_url } = req.body;

        const newProduct = new productModel({
            name,
            category,
            price,
            description,
            stock_quantity,
            images_url
        });
        console.log("Payload:", req.body);
        await newProduct.save();
        return res.status(201).json({ msg: 'Product created successfully', product: newProduct });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const products = await productModel.find();
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        return res.status(200).json({ product });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }

        const { name, category, price, description, stock_quantity, images_url } = req.body;

        if (images_url && Array.isArray(images_url)) {
            const imagesToDelete = product.images_url.filter(
                oldImg => !images_url.some(newImg => newImg.public_id === oldImg.public_id)
            );

            for (const img of imagesToDelete) {
                await deleteImage(img.public_id)
            }
            product.images_url = images_url;
        }

        product.name = name || product.name;
        product.category = category || product.category;
        product.price = price ?? product.price;
        product.description = description || product.description;
        product.stock_quantity = stock_quantity ?? product.stock_quantity;

        await product.save();
        return res.status(200).json({ msg: 'Product updated successfully', product });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: "Product not found." })
        }
        for (const img of product.images_url) {
            await deleteImage(img.public_id);
        }

        const result = await product.deleteOne();
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Failed to delete product' });
        }
        return res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.category) {
            query.category = { $regex: req.query.category, $options: 'i' };
        }

        const products = await productModel.find(query);
        return res.status(200).json({ products });
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
