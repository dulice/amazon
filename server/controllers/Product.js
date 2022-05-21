const expressAsyncHandler = require("express-async-handler");
const Product = require('../models/product');

const createProduct =  expressAsyncHandler ( async ( req, res ) => {
    const product = await new Product({
        name: `sample name ${Date.now()}`,
        slug:  `sample name ${Date.now()}`,
        category: 'sample category',
        brand: 'sample brand',
        image: '/images/p1.jpg',
        description: 'sample description',
        price: 0,
        countInStock: 0,
        rating: 0,
        numReviews: 0,
    });
    const saveProduct = await product.save();
    res.status(200).json(saveProduct);
})

const getAllProducts = expressAsyncHandler ( async (req, res) => {
    const products = await Product.find();
    res.status(200).json(products);
})

const searchProducts = expressAsyncHandler( async (req, res) => {
    const PAGE_SIZE = 3
    const { query } = req;
    const page = query.page || 1;
    const pageSize = query.pageSize || PAGE_SIZE;
    const rating = query.rating || '';
    const price = query.price || '';
    const category = query.category || '';
    const order = query.order || '';
    const searchQuery = query.query || '';

    const queryFilter = searchQuery && searchQuery !== 'all'
        ? {
            name: {
                $regex: searchQuery,
                $options: 'i'
            }
        } : {};

    const categoryFilter = category && category !== 'all'
        ? {category} : {};

    const ratingFilter = rating && rating !== 'all'
        ? {
            rating: {
                $gte: Number(rating)
            }
        } : {};

    const priceFilter = price && price !== 'all'
        ? {
            price: {
                $gte: Number(price.split('-')[0]),
                $lte: Number(price.split('-')[1])
            }
        } : {};

    const sortOrder = order === 'featured'
        ? {featured: -1}
        : order === 'lowest'
        ? {price: 1}
        : order === 'highest'
        ? {price: -1}
        : order === 'toprated'
        ? { rating: -1}
        : order === 'newest'
        ? { createdAt: -1}
        : { id: -1 }

    const products = await Product.find({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter
    })
    .sort(sortOrder)
    .skip(pageSize * (page -1))
    .limit(pageSize);

    const countProducts = await Product.countDocuments({
        ...queryFilter,
        ...categoryFilter,
        ...ratingFilter,
        ...priceFilter
    });

    res.status(200).json({
        products,
        countProducts,
        page,
        pages: Math.ceil(countProducts/ pageSize)
    })
})

const getCategory = expressAsyncHandler ( async (req,res) => {
    const category = await Product.find().distinct('category');
    res.status(200).json(category);
})

const updateProduct = expressAsyncHandler ( async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        const updateProduct = await Product.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updateProduct);
    } else {
        res.status(400).json({message: "Product Not Found"});
    }
})

const getSingleProduct =  expressAsyncHandler ( async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        // const reviewProduct = await Product.aggregate( [ { $unwind : "$reviews" } ] );
        res.status(200).json(product); 
    } else {
        res.status(400).json({message: "Product not found!"})
    }
})

const deleteProduct = expressAsyncHandler (async (req, res) => {
    const product = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(product);
})

const createReview = expressAsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if(product) {
        const alreadyReview = product.reviews.find(r => r.user.toString() === req.user._id.toString());
        if(alreadyReview) return res.status(404).json({message: "You already review!"});
        const review = {
            name: req.user.name,
            rating: req.body.rating,
            comment: req.body.comment,
            user: req.user._id
        }
        product.reviews.push(review);
        product.numReviews = product.reviews.length;
        product.rating = product.reviews.reduce((sum, num) => sum + num.rating, 0) / product.reviews.length;
        await product.save();
        res.status(200).json(product)
    } else {
        res.status(400).json({message: "Product not found"});
    }
});

module.exports = { createProduct, getAllProducts, searchProducts, getCategory, updateProduct, getSingleProduct, deleteProduct, createReview }