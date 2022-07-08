require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyPaser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set('view engine', 'ejs');
app.use(bodyPaser.urlencoded({extended: true}));
app.use(express.static('public'));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

const User = new mongoose.model('User', userSchema);


app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

// save user's info to database
app.post('/register', function(req, res){
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err){
    if(!err){
      res.render("secrets");
    }else{
      console.log(err);
    }
  });
})

app.post('/login', function(req, res){
  const email = req.body.username;
  const password = req.body.password;
  User.findOne({email: email}, function(err, result){
    if(result){
      if(result.password === password){
          res.render("secrets");
      }else{
        res.send("The password is incorrect");
      }
    }else{
      res.send("The email is not valid");
    }
  })
});

app.listen('3000', function(){
  console.log("Server started");
});
