const User = require('../models/User');
const { generateToken } = require('../validation');
const bcrypt = require('bcrypt');
const expressAsyncHandler = require('express-async-handler');

const getAllUsers = expressAsyncHandler (async (req, res) => {
    const user = await User.find();
    res.status(200).send(user);
});

const SignUp = expressAsyncHandler ( async (req, res) => {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const existUser = await User.findOne({email: req.body.email});
    if(existUser) return res.status(400).json({message: "Email Already Exist"});
    const user = await new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
    })
    await user.save();
    res.status(200).json(
        {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user)
    }
    );
});

const SignIn = expressAsyncHandler ( async (req, res) => {
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(404).json({message: "Email doesn't Exist"});

     const validPassword = await bcrypt.compare( req.body.password, user.password);
    if(!validPassword) return res.status(400).send('Invalid Password');

    res.status(200).json({
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user)
    });

});

const updateProfile = expressAsyncHandler( async (req, res) => {
    const user = await User.findById(req.user._id);
    if(user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if(req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashPassword
            const updateUser = await user.save();
            res.status(200).json({
                _id: updateUser._id,
                name: updateUser.name,
                email: updateUser.email,
                isAdmin: updateUser.isAdmin,
                token: generateToken(updateUser)
            })
        }
    } else {
        res.status(404).json({message: "User not found!"});
    }
})

module.exports = { SignUp, SignIn, getAllUsers, updateProfile }