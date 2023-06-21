require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt=require("mongoose-encryption")

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//////////////////////////////////Connecting Mongoose//////////////////////////////////////////////////////

mongoose.connect("mongodb://0.0.0.0:27017/userDB",{useNewUrlParser:true});

//////////////////////////////////Defining Schema ////////////////////////////////////////////////////////////

const userSchema=new mongoose.Schema({
    email:String,
    password:String
});
////////////////////////////////Defining Encryption String////////////////////////

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

/////////////////////////////Creating a Model Based on Schema/////////////////////////////////////////////////////////

const User= new mongoose.model("User",userSchema);

////////////////////////////////Defining Routes///////////////////////////////////////////////////////////////////
app.get("/",function(req,res){
    res.render("home");
});

app.get("/login",function(req,res){
    res.render("login");
})
app.get("/register",function(req,res){
    res.render("register");
})

app.post("/register",function(req,res){
    const newUser=new User({
        email:req.body.username,
        password:req.body.password
    });
    newUser.save()
    .then(function(){
        res.render("secrets");
    })
    .catch(function(err){
        console.log(err);
    })
})

app.post("/login",function(req,res){
    const username=req.body.username,
    password=req.body.password

    User.findOne({email:username})
    .then(function(foundUser){
        if(!foundUser){
            res.status(401).send("Invalid Username or Password");
        }
        if(foundUser && foundUser.password!=password){
            res.status(401).send("Invalid Username or Password");
        }
        else if(foundUser.password===password){
            res.render("secrets");
        }
    })
    .catch(function(err){
        console.log(err);
    })
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});