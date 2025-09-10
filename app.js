const express = require('express');
const app = express();
const cors = require('cors');
const movieRoutes = require('./routes/movie.routes');
const adminRoutes = require('./routes/admin.routes');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/api/movie', movieRoutes);
app.use('/api/admin', adminRoutes);

module.exports = app;