const cloudinary = require("../config/cloudinary.config");

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error("Failed to delete image: " + error.message);
    }
};

module.exports = deleteImage;