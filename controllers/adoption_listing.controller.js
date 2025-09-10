const adoptionListingModel = require('../models/adoptionListing.model');

const createNew = async (req, res) => {
    try {
        const { shelter_id, pet_name, species, breed, age, status } = req.body;

        const newListing = new adoptionListingModel({
            shelter_id,
            pet_name,
            species,
            breed,
            age,
            status
        });

        await newListing.save();
        return res.status(201).json({ msg: 'Adoption listing created successfully', listing: newListing });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const listings = await adoptionListingModel.find()
            .populate('shelter_id', 'name email role');
        return res.status(200).json({ listings });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const listing = await adoptionListingModel.findById(req.params.id)
            .populate('shelter_id', 'name email role');

        if (!listing) {
            return res.status(404).json({ msg: 'Adoption listing not found' });
        }
        return res.status(200).json({ listing });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const listing = await adoptionListingModel.findById(req.params.id);
        if (!listing) {
            return res.status(404).json({ msg: 'Adoption listing not found' });
        }

        const { pet_name, species, breed, age, status } = req.body;

        listing.pet_name = pet_name || listing.pet_name;
        listing.species = species || listing.species;
        listing.breed = breed || listing.breed;
        listing.age = age ?? listing.age;
        listing.status = status || listing.status;

        await listing.save();
        return res.status(200).json({ msg: 'Adoption listing updated successfully', listing });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        const result = await adoptionListingModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Adoption listing not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'Adoption listing deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.species) {
            query.species = { $regex: req.query.species, $options: 'i' };
        }
        if (req.query.breed) {
            query.breed = { $regex: req.query.breed, $options: 'i' };
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.pet_name) {
            query.pet_name = { $regex: req.query.pet_name, $options: 'i' };
        }

        const listings = await adoptionListingModel.find(query)
            .populate('shelter_id', 'name email role');
        return res.status(200).json({ listings });
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
