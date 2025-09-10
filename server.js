require('dotenv').config();
const { connectDB } = require('./config/db');
const app = require('./app.js');

connectDB();

app.listen(process.env.PORT || 5000, () => {
    console.log('Server is running on port', process.env.PORT || 5000);
})