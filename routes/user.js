const express = require('express');
const users = express.Router();
const User = require("../models/user");
// const SendGrid = require('./sendGrid');

users.get('/login', (req, res) => {
    const type = "admin";
    User.findOne({ type }, "type accessCode").then(admin => {
        const accessCode = admin.accessCode;
        res.render('login', { accessCode: accessCode }); 
    });
});

users.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({username}, "username password").then(user => {
        if(!user) {
            // User not found
            return res.status(401).send({ message: "Wrong Username" });
        }
        // check password
        user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
                // Password does not match
                return res.status(401).send({ message: "Wrong Username or password" });
            }
            // Create a token
            const token = jwt.sign({_id: user._id, username: user.username}, process.env.SECRET, {
                expiresIn: "60 days"
            });
            // Set a cookie and redirect to root
            res.cookie("nToken", token, {maxAge: 900000, httpOnly:true});
            User.findById(user._id).then(user => {
                res.redirect('dashboard');
            })
            
        });
    })
    .catch(err => {
        console.log(err);
    });
});

// REQUEST INVITE POST
users.post("/request-invite", (req, res) => {
    const user = new User(req.body);
    console.log("user:", user);
    user.save().then((user) => {
        res.redirect("/events");
    });
});

users.get('/request-invite', (req, res) => {
    res.render('request-invite', {layout: 'request-layout'});
});

// LOGOUT
users.get('/logout', (req, res) => {
    res.clearCookie('nToken');
    res.redirect('/');
});

module.exports = users;