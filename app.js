//jshint esversion:6

require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const { stringify } = require("querystring");

const app =express();


app.use(express.static("public"));
app.set("view engine",'ejs');
app.use(bodyParser.urlencoded({
    extended:true
}));

mongoose.connect("mongodb://localhost:27017/skillManagement",{useNewUrlParser:true,useUnifiedTopology: true});
const userSchema =new mongoose.Schema({
email :String,
password:String
});

userSchema.plugin(encrypt,{secret:process.env.SECRET,encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema); 

app.get("/",function(req,res){
    res.render("home");
});

app.get("/login1",function(req,res){
    res.render("login1",{autherror:""});
});

app.get("/register",function(req,res){
    res.render("register",{registrationerror:""});
});

app.get("/home",function(req,res){
    res.render("home");
});

app.post("/register",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,founduser){
        if(err) {
            console.log(err +"Saurabh");
                } else {
                    if(founduser) {
                        res.render("register",{registrationerror:"User Already Exists !!!"});
                                    }
                     else
                        {
                            const newUser = new User({
                                email:req.body.username,
                                password:req.body.password
                            });

                            newUser.save(function(err){
                                if(err) {
                                    console.log(err);
                                } else{
                                    res.render("register",{registrationerror:"User Saved successfully!!!"});
                                }

                        });
                    }
                }                 
    
    
    })
})

app.post("/login1",function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({email:username},function(err,founduser){
        if(err) {
            console.log(err +"Saurabh");
                } else {
                    if(founduser) {
                                if (founduser.password===password){

                                    res.render("secrets");
                                                              }
                                else {
                                    res.render("login1",{autherror:"Authentication failed"});
                                     }
                                  }
                    else{
                        res.render("login1",{autherror:"User not found"});
                    }
                }

            })

    
    
})


app.listen(3000,function(){
    console.log("Server Started on post 3000");
});
