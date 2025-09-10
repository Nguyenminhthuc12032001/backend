const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const petRoutes = require('./routes/pet.routes');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/api/user', userRoutes);
app.use('/api/pet',petRoutes);

module.exports = app;