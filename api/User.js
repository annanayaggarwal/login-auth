const express = require('express')
const router = express.Router();


//mongodb user model
const User = require('./../models/User')

//mongodb userverification model
const UserVerification = require('./../models/userverification')

// email handler
const nodemailer = require('nodemailer');

//unique string
const uuid = require('uuid');

//secret file
require("dotenv").config();

//password handler
const bcrypt = require('bcrypt');

//nodemailer transporter
let transporter = nodemailer.createTransport({
    service : "gmail",
    // secure : true,
    auth:{
        user : process.env.AUTH_EMAIL,
        pass : process.env.AUTH_PASS,
    }
})

transporter.verify((error,success)=>{
    if(error){
        console.log(error)
    }else{
        console.log("ready for messages")
        console.log(success);
    }
})

router.post('/signup',(req,res) =>{
    let {name,shopname, contact, email, password} = req.body;
    // name = name.trim();
    // shopname = shopname.trim();
    // contact = contact.trim();
    // email = email.trim();
    // password = password.trim();

if(name =="" || shopname == "" || contact == "" || email =="" || password ==""){
    res.json({
        status:"failed",
        message:"empty fields"
    })
}else if(!/^[a-zA-Z]*$/.test(shopname)){
    res.json({
        status:"failed",
        message:"enter a valid name"
    })
}else if(!/^[a-zA-Z]*$/.test(name)){
    res.json({
        status:"failed",
        message:"enter a valid name"
    })
// }else if(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)){
//     res.json({
//         status:"failed",
//         message:"enter a valid email"
//     })
}else if(password.length<8){
      res.json({
        status:"failed",
        message:"password must be greater than 8 characters"
    })
}else{
    User.find({email}).then(result=>{
        if(result.length){
            //if user alresdy exists
            res.json({
                status:"failed",
                message:"User with this mail already exist"
            })
        }else{
            //try to create new user
            const saltrounds = 10;
            bcrypt.hash(password,saltrounds).then(hashedPassword =>{
                const NewUser = new User({
                    shopname,
                    contact,
                    name,
                    email,
                    password:hashedPassword
                })

                NewUser.save().then(result=>{
                    res.json({
                        status:"SUCCESS",
                        message:"SignUp successfull",
                        data: result,
                    })
                })
                .catch(err=>{
                    res.json({
                        status:"failed",
                        message:"error occured while creating the user"
                    })
                })
            })

        }
    }).catch(err=>{
        console.log(err)
        res.json({
            status:"failed",
            message:"error occured while checking for existing user"
        })
    })
}
})


router.post('/signin',function(req,res){
    let {email, password} = req.body;
    if(email =="" || password ==""){
        res.json({
            status:"failed",
            message:"empty fields"
        })
    }else{
        User.find({email}).then(data=>{
            if(data.length){
                const hashedPassword = data[0].password;
                bcrypt.compare(password,hashedPassword).then(result=>{
                    if(result){
                        res.json({
                            status:"SUCCESS",
                            message:"SignUp successfull",
                            data: result,
                        })
                    }else{
                        res.json({
                            status:"FAILED",
                            message:"Wrong password",
                        })
                    }
                })
                .catch(err=>{
                    res.json({
                        status:"FAILED",
                        message:"error occured while comparing",
                    })
                })
            }else{
                res.json({
                    status:"FAILED",
                    message:"invalid credentials",
                })
            }
        })
        .catch(err=>{
            res.json({
                status:"FAILED",
                message:"error occured while checking for existing user",
            })
        })
    }
})

module.exports = router;