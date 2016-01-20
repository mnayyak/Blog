var User = require('../models/user.js');
var Story = require('../models/story.js');

var config = require('../../config')

var secretKey = config.secretKey;

// var express = require('express');

var jsonwebtoken = require('jsonwebtoken');

function createToken (user){
	
var token = jsonwebtoken.sign({
		id: user._id,
		name: user.name,
		username: user.username
	},secretKey,{
		expiresInMinute: 1440
	})
return token;
}

module.exports = function (app, express, io) {
	
	var api = express.Router();

	api.get('/all_stories',function(req, res){
		console.log("Inside All-stories")
		Story.find({}, function(err, stories){
			if(err){
				res.send(err);
				return;
			}else{
				res.json(stories)
			}
		});
	});


	api.post('/singup', function(req, res){
		console.log("Inside singup"+req.body.username);
		var user = new User({
			name	: req.body.name,
			username:  req.body.username,
			password:  req.body.password
		});
		var token = createToken(user);
		console.log(token);

		user.save(function(err){
			console.log("User Save");
			if(err){
				res.send(err);
				console.log("Error Message for Signup === >");
				console.log(res);
				return;
			}
			res.json({
				success: true,
				message: 'User Has been created',
				token: token
			 });
		});
	});

	api.get('/users', function(req, res){
		console.log("Inside Users"+req);
		User.find({}, function(err, users){
			if(err){
				res.send(err);
				return;
			}

			res.json(users);
		});
	});

	api.post('/login', function(req, res){
		console.log("Inside Login"+res);
		User.findOne({
			username: req.body.username
		}).select('name username password').exec(function(err, user){
			if(err) throw err;

			if(!user){
				res.send({message: "User Doesnot Exist"});
			}else{
				var validPassword = user.comparePassword(req.body.password);
				if(!validPassword) {
					res.send({message : "Invalid password"});
				}else{
					var token = createToken(user);
					res.json({
						Success: true,
						message: "Successfull login",
						token: token
					});
				}
			}
		});
	});

	api.use(function(req, res, next){

		console.log("I am using this app");

		var token = req.body.token || req.param('token') || req.headers['x-access-token'];

		if(token){
			jsonwebtoken.verify(token, secretKey, function(err, decoded){
				if(err){
					res.status(403).send({success: false , message:"Authentication failed"});
				}else{
					req.decoded = decoded;
					next();
				}
			});
		}else{
			res.status(403).send({success: false, message: "No token is present"});
		}

	});

	api.route('/')
		.post(function(req, res){
			var story= new Story({
				creator: req.decoded.id,
				content: req.body.content
			});
			story.save(function(err, newStory){
				if(err){
					res.send(err);
					return;
				}else{
					io.emit('story', newStory);
					res.json({message: "New Story has been crteated"});
				}
			});
		})

		.get(function(req, res){
			Story.find({creator: req.decoded.id}, function(err, storeies){
				if(err){
					res.send(err);
					return;
				}else{
					res.json(storeies);
				}
			});
		});

	api.get('/me', function(req, res){
		console.log("Inside me");
		res.send(req.decoded);
		
	});
	return api;
}