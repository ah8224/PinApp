const express = require('express')
const mongoose = require('mongoose')
require('dotenv').config()
const pinRoute = require('./routes/pin')
const userRoute = require('./routes/user')
const app = express()

app.use(express.json())

mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MongoDB Connected...")
}).catch(()=>{
    console.log("MongoDB Connection Failed...")
});

app.use('/api/pin',pinRoute)
app.use('/api/user',userRoute)

app.listen(8080,(res,req)=>{
    console.log("Hi")
})