const router = require('express').Router()
const User =require('../models/User')
const bcrypt = require('bcrypt');


// register
router.post("/register",async (req,res)=>{
    try {
        // generating hased password
        const salt =await bcrypt.genSalt(10)
        const hash_password = await bcrypt.hash(req.body.password,salt)
        // create new user
        const newUser = new User({
            username:req.body.username,
            password:hash_password,
            email:req.body.email
        })

        const user =await newUser.save()
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json(err)
    }
})
// login
router.post("/login",async (req,res)=>{
    try {
        const user = await User.findOne({username:req.body.username})
        !user && res.status(400).json('Wrong username/password !')
        const validPassword=bcrypt.compare(req.body.password,user.password)
        !validPassword && res.status(400).json('Wrong username/password !')
        res.status(200).json(user.username)
    }
    catch (err) {
        res.status(500).json(err)
    }
})

module.exports = router