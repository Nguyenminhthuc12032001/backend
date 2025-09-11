const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const petRoutes = require('./routes/pet.routes');
const healthRecordRoutes = require("./routes/healthRecord.routes");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/api/user', userRoutes);
app.use('/api/pet', petRoutes);
app.use("/api/healthRecord", healthRecordRoutes);

module.exports = app;