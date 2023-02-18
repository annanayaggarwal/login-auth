require('./config/db')
const userrouter = require('./api/User')
const express =require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// app.use(cors());

const app = express();

app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.use('/user',userrouter)

app.listen(5000,function(req,res){
    console.log("server is running on port 3000");
})