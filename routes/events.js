const events = require('express').Router();
const User = require("../models/user");
const Event = require("../models/event");
// Set your secret key: remember to change this to your live secret key in production
// See your keys here: https://dashboard.stripe.com/account/apikeys
const SendGrid = require('./sendGrid');
const stripe = require("stripe")("sk_test_CKhY3B72JlPjNAM0S8MmQscw");

events.get('/events', (req,res) => {
    res.render('events');
    // const currentUser = req.user;
    // if (currentUser) {
    //     events.find().then((events) => {
    //         res.render('events', { events });
    //     });
    // } else {
    //     res.render('login', { layout: 'no-footer'});
    // };
});

// POST A NEW WEBSITE REQUEST FROM NEW CLIENT DASHBOARD 
events.post('/dashboard', function(req, res, next) {
    const project = new Project(req.body);
    project.save().then(() => {
        User.findByIdAndUpdate(req.user._id, { $push: { projects: project._id } })
        .then(user => {
            SendGrid.sendWebsiteRequestEmail(user);
            res.redirect('/dashboard');
        });
    });
})

// GET DASHBOARD FOR ADMIN OR CLIENT
events.get('/dashboard', function(req, res, next) {
    if (req.user.isAdmin == false && req.user.projects.length > 0) {
        Project.findById(req.user.projects).populate('updates')
        .then(project => {
            if (project.updates.length > 0) {
                const latestUpdate = project.updates[project.updates.length-1];
                res.render('dashboard', { project, latestUpdate } );                
            } else {
                const underReviewStill = true;
                res.render('dashboard', { project, underReviewStill} )
            }
        }).catch(err => {
            console.log(err);
        })
    }
    else {
        // User.find
        User.find()
        .then(client => {
            res.render('dashboard', { client } );
        })
        .catch(err => {
            console.log(err);
        });
    };
});

// CLIENT SEND FEEDBACK TO ADMINS UPDATE
events.post('/dashboard/:updateId/feedback', (req,res) => {
    updateId = req.params.updateId;
    Update.findById(updateId)
    .then(update => {
        update.feedback.push(req.body);
        update.save()
        res.redirect('/dashboard');
    }).catch(err => {
        console.log(err);
        
    })
});

// CLIENT CHARGE
events.post('/dashboard/:projectId/charge', (req, res, next) => {
    console.log("IN THIS ROUTE");
    
    // Token is created using Checkout or Elements!
    // Get the payment token ID submitted by the form:
    const token = req.body.stripeToken; // Using Express
    Project.findById(req.params.projectId).then((project) => {
        console.log("found project");
        console.log("paymentsDue:", project.paymentsDue[0]);
        
        const charge = stripe.charges.create({
            amount: project.paymentsDue[0],
            currency: 'usd',
            description: 'Tech Made charge',
            source: token,
        })
        console.log("TOKEN HERE;", token);
        
        console.log("charge successful.");
        // , function(err, charge) { 
        //     if(err & err.type === "StripeCardError") {
        //         console.log("Your card was declined.");
        //     }
        
        project.paymentsCompleted.push(project.paymentsDue[0]);
        
        project.paymentsDue = [];
        project.save();
        res.redirect('/dashboard');
    }).catch((err) => {
        console.log(err);
    })
});

/* GET home page. */
events.get('/', function(req, res, next) {
    const currentUser = req.user;
    res.render('index', {currentUser});
});
  
module.exports = events;