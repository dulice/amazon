const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    orderItems: [{

        name: { type: String, required: true },
        slug: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true},
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
    }], 
    shippingAddress: {
        fullname: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true }
    },
    paymentMethod: { type: String, required: true},
    paymentResult: {
        id: String,
        status: String,
        update_time: Date,
        email_address: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    productPrice: { type: Number, required: true },
    taxPrice: { type: Number, required: true },
    shippingPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    isDelivered: { type: Boolean, default: false },
    deliveredAt: Date
},{timestamps: true})

const Order = mongoose.model('Order', orderSchema );
module.exports = Order;