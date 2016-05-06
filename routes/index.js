var express = require('express');
var router = express.Router();
var mongoUrl = "mongodb://localhost:27017/coffee";
var mongoose = require("mongoose");
var Account = require("../models/accounts");
var bcrypt = require("bcrypt-nodejs");
var randToken =  require("rand-token");
mongoose.connect(mongoUrl);

/* GET home page. */

router.get("/getUserData", function(req, res,next){
	Account.findOne(
		{token: req.query.token}, function(err, doc){
			if(doc == null){
				res.json({failure: "badToken"});
			}else{
				res.json(doc)
			}
		});
	});

router.post("/register", function(req, res, next){
	if(req.body.password != req.body.password2){
		res.json({"failure": "passwordMatch"});
	}else{
		var token = randToken.generate(32);
		var newAccount = new Account({
			username: req.body.username,
			password: bcrypt.hashSync(req.body.password),
			email: req.body.email,
			token: token
		});
		newAccount.save();
		res.json({
			success: "added",
			token: token
		});
	}
});

router.post("/login", function(req, res, next){
	Account.findOne(
		{username: req.body.username}, function(err, doc){
			console.log(err);
			console.log(doc);
			if(doc == null){
				res.json({failure: "noUser"});
			}else{
				var passwordsMatch = bcrypt.compareSync(req.body.password, doc.password);
				if(passwordsMatch){
					res.json({
						success: "found",
						token: doc.token
					});
				}else{
					res.json({failure: "badPassword"});
				}
			}
		} 
	)
});

router.post("/options", function(req,res,next){
	Account.update(
		{token: req.body.token},
		{quantity: req.body.quantity, frequency: req.body.frequency, grind: req.body.grind},
		{upsert: true},
		function(err, account){
			if (account == null){
				//no doc in db
			}else{
				//we got a record and updated it
				account.save;
				res.json({success: "update"});
			}
		}
	)
});

router.post("/shipping", function(req,res,next){
	Account.update(
		{token: req.body.token},
		{fullname: req.body.fullname, address: req.body.address, address2: req.body.address2, city: req.body.city, state: req.body.state, zip: req.body.zip, deliveryDate: req.body.deliveryDate},
		{upsert: true},
		function(err, account){
			if (account == null){
				//no doc in db
			}else{
				//we got a record and updated it
				account.save;
				res.json({success: "update"});
			}
		}
	)
});











module.exports = router;
