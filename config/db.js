require('dotenv').config()
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

.then(()=>{
    console.log("db connected")
})

.catch((err)=> console.log(err));