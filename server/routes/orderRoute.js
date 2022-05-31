const expressAsyncHandler = require('express-async-handler');
const { isAuth, isAdmin } = require('../validation');
const Order =require('../models/orderProduct');
const User = require('../models/User');
const Product = require('../models/product');
const { createOrder, orderSummary, singleUserOrderHistory, getSingleOrder, getAllOrders, deliveredOrder, paymentOrder } = require('../controllers/Orders');

const router = require('express').Router();

router.post('/placeorder',isAuth, createOrder);
router.get('/admin', isAuth, isAdmin, getAllOrders);
router.get('/history', isAuth, singleUserOrderHistory);
router.get('/summary', isAuth, isAdmin, orderSummary);
router.get('/:id', isAuth, getSingleOrder);
router.put('/:id/delivered', isAuth, isAdmin, deliveredOrder);
router.post('/:id/payment', isAuth, paymentOrder)

module.exports = router;