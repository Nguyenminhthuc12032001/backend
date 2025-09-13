const adoptionListingModel = require('../models/adoption_listing.model');
const userModel = require('../models/user.model');
const deleteImage = require('../utils/deleteImage');

const createNew = async (req, res) => {
    try {
        const { pet_name, species, breed, age, images_url } = req.body;
        if (req.user.role !== "shelter") {
            return res.status(403).json({ msg: "Only shelter accounts can create new pet adoption listings." })
        }

        const newPet = new adoptionListingModel({
            shelter_id: req.user.id,
            pet_name,
            species,
            breed,
            age,
            images_url
        });
        await newPet.save();
        return res.status(201).json({ msg: 'Adoption listing created successfully', pet: newPet });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAll = async (req, res) => {
    try {
        const listings = await adoptionListingModel.find({ isDeleted: false })
            .populate('shelter_id', 'name email role');

        await Promise.all(
            listings.map(async (pet) => {
                if (pet.shelter_id.role != "shelter") {
                    pet.isDeleted = true;
                    await pet.save();
                    for (const img of pet.images_url) {
                        await deleteImage(img.public_id);
                    }
                }
            }))
        return res.status(200).json({ listings });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const get = async (req, res) => {
    try {
        const pet = await adoptionListingModel.findOne({ _id: req.params.id, isDeleted: false })
            .populate('shelter_id', 'name email role');

        if (!pet) {
            return res.status(404).json({ msg: 'Adoption listing not found' });
        }

        if (pet.shelter_id.role != "shelter") {
            pet.isDeleted = true;
            await pet.save();
            for (const img of pet.images_url) {
                await deleteImage(img.public_id);
            }
        }

        return res.status(200).json({ pet });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const update = async (req, res) => {
    try {
        const listing = await adoptionListingModel.findOne({ _id: req.params.id, shelter_id: req.user.id });
        if (!listing) {
            return res.status(404).json({ msg: 'Adoption listing not found' });
        }

        const { pet_name, species, breed, age, images_url } = req.body;

        if (images_url && Array.isArray(images_url)) {
            const imagesToDelete = listing.images_url.filter(
                oldImg => !images_url.some(newImg => newImg.public_id === oldImg.public_id)
            );

            for (const img of imagesToDelete) {
                await deleteImage(img.public_id);
            }
            listing.images_url = images_url;
        }

        listing.pet_name = pet_name || listing.pet_name;
        listing.species = species || listing.species;
        listing.breed = breed || listing.breed;
        listing.age = age ?? listing.age;

        await listing.save();
        return res.status(200).json({ msg: 'Adoption listing updated successfully', listing });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const remove = async (req, res) => {
    try {
        if (req.user.role !== "shelter") {
            return res.status(403).json({ msg: "Only shelter accounts can delete adoption listings." });
        }
        const adoptionListing = await adoptionListingModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { isDeleted: true });
        if (!adoptionListing) {
            return res.status(404).json({ msg: 'Adoption listing not found, unable to delete' });
        }

        if (adoptionListing.images_url && adoptionListing.images_url.length > 0)
            await Promise.all(
                adoptionListing.images_url.map(img => deleteImage(img.public_id))
            );
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

const requestAdoption = async (req, res) => {
    try {
        const pet_id = req.params.id;
        const pet = await adoptionListingModel.findOne({ _id: pet_id, isDeleted: false, status: "available" }).populate("shelter_id", "email name");
        if (!pet) {
            return res.status(404).json({ msg: "Pet not available for adoption." });
        }
        pet.status = "pending";
        await pet.save();
        await sendEmail(
            pet.shelter_id.email,
            "Adoption Request Submitted",
            `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #333;">
                <h2 style="color:#000;">Hello ${pet.shelter_id.name},</h2>
                <p>Your request to adopt <strong>${pet.name}</strong> has been submitted successfully.</p>
                <p>The shelter will review your request and contact you soon.</p>
                <p style="margin-top:20px; font-size:14px; color:#555;">Thank you for choosing adoption.</p>
            </div>
            `
        );

        return res.status(200).json({ msg: "Adoption request submitted." })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const confirmAdoption = async (req, res) => {
    try {
        if (req.user.role != "shelter") {
            return res.status(403).json({ msg: "Only shelter can confirm this adoption." })
        }
        const { pet_id } = req.body;
        const pet = await adoptionListingModel.findOne({ _id: pet_id, status: "pending", isDeleted: false }).populate("shelter_id", "email name");
        if (!pet) {
            return res.status(404).json({ msg: "Adoption request not found." });
        }
        pet.status = "adopted";
        await pet.save();
        await sendEmail(
            pet.shelter_id.email,
            "Adoption Approved 🎉",
            `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #333;">
                <h2 style="color:#000;">Congratulations ${pet.shelter_id.name},</h2>
                <p>Your adoption request for <strong>${pet.name}</strong> has been <span style="color:green;font-weight:bold;">approved</span>.</p>
                <p>The shelter will reach out with details to complete the process.</p>
                <p style="margin-top:20px; font-size:14px; color:#555;">We’re happy to see a pet find a loving home.</p>
            </div>
            `
        );
        return res.status(200).json({ msg: "Adoption confirm successfully." });
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

const rejectAdoption = async (req, res) => {
    try {
        if (req.user.role != "shelter") {
            return res.status.json({ msg: "Only shelter can confirm this adoption." })
        }
        const { pet_id } = req.body;
        const pet = await adoptionListingModel.findOne({ _id: pet_id, status: "pending", isDeleted: false }).populate("shelter_id", "email name");
        if (!pet) {
            return res.status(404).json({ msg: "Adoption request not found." });
        }
        res.status = "available";
        await pet.save();
        await sendEmail(
            pet.shelter_id.email,
            "Adoption Request Update",
            `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; color: #333;">
                <h2 style="color:#000;">Hello ${pet.shelter_id.name},</h2>
                <p>We’re sorry to inform you that your request to adopt <strong>${pet.name}</strong> has been <span style="color:red;font-weight:bold;">rejected</span>.</p>
                <p>You may explore other pets available for adoption in our listings.</p>
                <p style="margin-top:20px; font-size:14px; color:#555;">Thank you for your kindness and understanding.</p>
            </div>
            `
        );
        return res.status(200).json({ msg: "Adoption rejected." })
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
}

module.exports = {
    createNew,
    getAll,
    get,
    update,
    remove,
    search,
    requestAdoption,
    confirmAdoption,
    rejectAdoption
};
