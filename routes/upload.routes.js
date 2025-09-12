const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const { verifyToken, checkRole } = require('../middlewares/authentication.middlewares');

router.post('/sign-upload', [verifyToken, checkRole("admin")], (req, res) => {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const { folder } = req.body;

    const signature = crypto
      .createHash("sha1")
        .update(`folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`)
      .digest("hex");

    res.json({
      timestamp,
      signature,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        folder_signed: folder
    })
})

module.exports = router;