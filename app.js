const express = require('express');
const app = express();
const cors = require('cors');

const userRoutes = require('./routes/user.routes');
const petRoutes = require('./routes/pet.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const signUpload = require('./routes/upload.routes');
const productRoutes = require('./routes/product.routes');
const signUploadRoutes = require('./routes/upload.routes');
const orderRoutes = require('./routes/order.routes');
const adoptListRoutes = require('./routes/adoption_listing.routes')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'))
app.use('/api/user', userRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/product', productRoutes);
app.use('/api/upload', signUpload);
app.use('/api/appointment', appointmentRoutes);
app.use('/api/upload', signUploadRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/adopt', adoptListRoutes);

module.exports = app;