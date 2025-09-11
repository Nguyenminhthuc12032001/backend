const petModel = require('../models/pet.model');
const mongoose = require("mongoose"); 

//Chức năng tạo pet mới cho chủ sỡ hữu (owner_id)
const createNew = async (req, res) => {
    try {
        console.log(req.body);
        //Nhận giá trị từ frontend
        const { owner_id, name, species, breed, age, gender, description,images } = req.body;
        const newPet = new petModel({ owner_id, name, species, breed, age, gender, description,images });
        /*
        await newPet.save() → lưu vào MongoDB.
        Nếu thành công: trả status 201 (Created) + pet vừa tạo.
        Nếu lỗi: trả status 500 (Internal Server Error).*/
        await newPet.save();
        return res.status(201).json({ msg: 'Pet created successfully', pet: newPet });
    } catch (error) {
        //Neu ko co ownerID se bao
        return res.status(500).json({ error: error.message });
    }
};

//Lấy tất cả dữ liệu của Pet chủ sỡ hữu
const getAll = async (req, res) => {
  try {
    const pets = await petModel.find({ owner_id: req.user.id });
    return res.status(200).json({ pets });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//Lấy 1 pet theo id
const get = async (req, res) => {
    try {
        const pet = await petModel.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ msg: 'Pet not found' });
        }
        return res.status(200).json({ pet });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
//Cập nhật pet
const update = async (req, res) => {
    try {
        //req.params.id → lấy id từ URL (/pets/:id).
        const pet = await petModel.findById(req.params.id);
        if (!pet) {
            return res.status(404).json({ msg: 'Pet not found' });
        }

        const { name, species, breed, age, gender, description } = req.body;

        pet.name = name || pet.name;
        pet.species = species || pet.species;
        pet.breed = breed || pet.breed;
        pet.age = age ?? pet.age;
        pet.gender = gender || pet.gender;
        pet.description = description || pet.description;

        await pet.save();
        return res.status(200).json({ msg: 'Pet updated successfully', pet });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


//xóa pet(remove)
const remove = async (req, res) => {
    
    // 🔎 Kiểm tra ObjectId hợp lệ
    const { id } = req.params; 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Pet ID format" });
    }
    try {
        const result = await petModel.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Pet not found, unable to delete' });
        }
        return res.status(200).json({ msg: 'Pet deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Tìm kiếm pet theo tiêu chí
const search = async (req, res) => {
    try {
        const query = {};
        if (req.query.name) {
            query.name = { $regex: req.query.name, $options: 'i' };
        }
        if (req.query.species) {
            query.species = { $regex: req.query.species, $options: 'i' };
        }
        if (req.query.breed) {
            query.breed = { $regex: req.query.breed, $options: 'i' };
        }
        if (req.query.gender) {
            query.gender = req.query.gender;
        }

        const pets = await petModel.find(query).populate('owner_id', 'name email');
        return res.status(200).json({ pets });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};


// Thêm 1 hoặc nhiều ảnh
const addImages = async (req, res) => {
  try {
    const { images } = req.body; // mảng hoặc 1 string

    if (!images || images.length === 0) {
      return res.status(400).json({ msg: "No images provided" });
    }

    const updatedPet = await petModel.findByIdAndUpdate(
      req.params.id,
      { $push: { images: { $each: Array.isArray(images) ? images : [images] } } },
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ msg: "Pet not found" });
    }

    return res.status(200).json({ msg: "Images added successfully", pet: updatedPet });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

// Xóa 1 ảnh theo đường link
const removeImage = async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ msg: "No image url provided" });
    }

    const updatedPet = await petModel.findByIdAndUpdate(
      req.params.id,
      { $pull: { images: imageUrl } },
      { new: true }
    );

    if (!updatedPet) {
      return res.status(404).json({ msg: "Pet not found" });
    }

    return res.status(200).json({ msg: "Image removed successfully", pet: updatedPet });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};





module.exports = {
    createNew,
    getAll,
    get,
    update,
    search,
    remove,
    addImages,
    removeImage
};
