const Order = require('../models/orderProduct');
const User = require('../models/User');
const Product = require('../models/product');
const expressAsyncHandler = require('express-async-handler');
const { payOrderEmailTamplate, mailgun } = require('../validation');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createOrder = expressAsyncHandler( async (req, res) => {
    const newOrder = new Order({
        orderItems: req.body.orderItems.map(item => ({...item, product: item._id })),
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod,
        user: req.user._id,
        productPrice: req.body.productPrice,
        taxPrice: req.body.taxPrice,
        shippingPrice: req.body.shippingPrice, 
        totalPrice: req.body.totalPrice
    });
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
});

const singleUserOrderHistory = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({user: req.user._id});
    if(orders) {
        res.status(200).json(orders);
    } else {
        res.status(400).json({message: "User not found!"});
    }
});

const orderSummary = expressAsyncHandler( async (req, res) => {
    const orders = await Order.aggregate([{
        $group: {
            _id: null,
            numOrders: {$sum: 1},
            totalSales: {$sum: '$totalPrice'}
        }
    }]);

    const users = await User.aggregate([{
        $group: {
            _id: null,
            numUsers: {$sum: 1}
        }
    }]);

    const dailyOrders = await Order.aggregate([{
        $group: {
            _id: { $dateToString: {format: '%Y-%m-%d', date: '$createdAt'}},
            orders: {$sum: 1},
            sales: {$sum: '$totalPrice'}
        }
    }, {$sort: { _id: 1}}
    ]);

    const categories = await Product.aggregate([{
        $group: {
            _id: '$category',
            count: {$sum: 1}
        }
    }]);

    res.status(200).json({
        orders,
        users,
        dailyOrders,
        categories
    })
});

const getSingleOrder = expressAsyncHandler( async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        res.status(200).json(order);
    } else {
        res.status(400).json({message: 'Order not Found.'})
    }
});

const getAllOrders = expressAsyncHandler (async (req, res) => {
    const orders = await Order.find().populate('user','name');
    res.status(200).json(orders);
});

const deliveredOrder = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        await order.save();        
        res.status(200).json({message: "Send order successfully!"});
    } else {
        res.status(400).json({message: "order not found!"});
    }
});

const paymentOrder = expressAsyncHandler ( async (req, res) => {
    const { token } = req.body;
    const order = await Order.findById(req.params.id).populate('user','name email');
    const product = await Order.findById(req.params.id);
    
    mailgun().messages().send({
        from: 'duliceellen600@gmail.com',
        to: `${order.user.email}`,
        subject: `New order ${order._id}`,
        html: payOrderEmailTamplate(order)
    }, (error, body) => {
        if(error) {
            console.log(error);
        } else {
            console.log("send",body);
        }
    })

    if(order) {
        order.isPaid = true;
        order.paidAt = Date.now();
    }
    await order.save();
    const customer = await stripe.customers.create({
        email: token.email,
        source: token.id,
    });
    const charges = await stripe.charges.create({
        amount: product.totalPrice * 100,
        currency: 'usd',
        customer: customer.id,
        receipt_email: token.email,
        description: `Purchase at ${Date.now().toLocaleString()}`,
        shipping: {
            name: token.card.name,
            address: {
                country: token.card.address_country
            }
        }
    })
    res.status(200).json(charges);

})
module.exports = { createOrder, singleUserOrderHistory, orderSummary, getSingleOrder, getAllOrders, deliveredOrder, paymentOrder };