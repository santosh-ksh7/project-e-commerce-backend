import express from "express";
import { client } from "../index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


// creating router and exporting it

const router = express.Router();

export const userRouter = router;

// creating router and exporting it



// async function to generate hash 

async function generateHash(pwd){
    const round = 5;
    const salt = await bcrypt.genSalt(round);
    const hash = await bcrypt.hash(pwd, salt);
    return hash;
}

// async function to generate hash 






// API for creating account

router.post("/create-account", async function(req, res){
    const data = req.body; 
    //  1st check whether email id already exists in DB
    const check4email = await client.db("e-commerce").collection("users").findOne({email: data.email});
    if(check4email){
        res.send({msgFail: "E-mail already in use by another user. Please use another email-id."})
    }else{
        // create a hash value for the password
        const hash_value = await generateHash(data.pwd);
        // creating the document structure before inserting the data
        const data2put = {
            ...data,
            pwd: hash_value,
            re_pwd: hash_value,
            profile_pic: "https://res.cloudinary.com/dz7pcmtxi/image/upload/v1658877142/blank-profile-picture-g3824f2029_1280_rpx6sg.png",
            address: "",
            mobile: "",
            gender: "",
            date_of_birth:""
        }
        const create_user = await client.db("e-commerce").collection("users").insertOne(data2put);
        if(create_user.insertedId){
            res.send({msgPass: "User has been succesfully created. Now you can log-in."});
        }
    }
})







// API for login

router.post("/login", async function(req, res){
    const data = req.body;
    // Check if email exists in DB
    const check4email = await client.db("e-commerce").collection("users").findOne({email: data.email});
    if(check4email){
        // Now check if password by user is same as password stored in DB
        // But since password stored in DB is a hash value you will need to compare the hash value 
        const compare = await bcrypt.compare(data.pwd, check4email.pwd);
        // This returns a boolean
        if(compare){
            // You also send the jwt token alongwith for secured routes
            const token = jwt.sign({id: check4email._id}, process.env.secret_key)
            res.send({msgPass: "Successfully Logged in", token: token, _id: check4email._id})
        }else{
            res.send({msgFail: "Invalid Credentials"})
        }
    }else{
        res.send({msgFail: "Invalid Credentials"})
    }
})