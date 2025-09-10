const petModel = require('../models/pet.model');


//Chức năng tạo pet mới cho chủ sỡ hữu (owner_id)
const createNew = async (req, res) => {
    try {
        //Nhận giá trị từ frontend
        const { owner_id, name, species, breed, age, gender, description } = req.body;
        const newPet = new petModel({ owner_id, name, species, breed, age, gender, description });
        /*
        await newPet.save() → lưu vào MongoDB.
        Nếu thành công: trả status 201 (Created) + pet vừa tạo.
        Nếu lỗi: trả status 500 (Internal Server Error).*/
        await newPet.save();
        return res.status(201).json({ msg: 'Pet created successfully', pet: newPet });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Lấy tất cả dữ liệu của Pet chủ sỡ hữu
const getAll = async (req, res) => {
    try {
        /*petModel.find() → lấy tất cả pet trong DB.
        .populate('owner_id', 'name email') → thay owner_id (ObjectId) 
        bằng thông tin chi tiết name, email từ bảng User. */
        const pets = await petModel.find().populate('owner_id', 'name email');
        return res.status(200).json({ pets });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Lấy 1 pet theo id
const get = async (req, res) => {
    try {
        const pet = await petModel.findById(req.params.id).populate('owner_id', 'name email');
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

module.exports = {
    createNew,
    getAll,
    get,
    update,
    remove,
    search
};
