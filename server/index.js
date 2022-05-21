const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const productRoute = require('./routes/productsRoute');
const userRoute = require('./routes/UserRoute');
const orderRoute = require('./routes/orderRoute'); 
const uploadRoute = require('./routes/uploadRoute'); 

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

dotenv.config();

mongoose.connect( process.env.DB_CONNECT)
    .then(() => {
        app.listen(5000);
        console.log('connect to db');
    })
    .catch ((err) => {
        console.log(err.message);
    });

app.use('/api/products', productRoute );
app.use('/api/users', userRoute);
app.use('/api/orders', orderRoute);
app.use('/api/upload', uploadRoute);