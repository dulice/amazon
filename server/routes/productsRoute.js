const express = require('express'); 
const router = express.Router();

const { createProduct, getAllProducts, searchProducts, getCategory, updateProduct, getSingleProduct, deleteProduct, createReview } = require('../controllers/Product');
const { isAuth, isAdmin } = require('../validation');

router.post('/', createProduct);
router.get('/', getAllProducts);
router.get('/search', searchProducts);
router.get('/category', getCategory);
router.put('/:id', isAuth, isAdmin, updateProduct );
router.get('/:id',getSingleProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);
router.post('/:id/review', isAuth, createReview)

module.exports = router;