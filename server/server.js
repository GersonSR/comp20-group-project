/*
 * Sever-side code for the Find the Way game, providing routes for score 
 * handling, directions serving, etc. Eventually, all content (including
 * our client-side content) will be served off of this server. 
 */

/* Initizlization of global package objects */
var express = require('express');
var cors    = require('cors');
var mongo   = require('mongodb').MongoClient, format = require('util').format;
var body_parser = require('body-parser');
var app = express();

/* Set up body-parser to handle request parameters */
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

/* Initialize a MongoDB connection */
var mongoUri = process.env.MONGODB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/findtheway';
var db = mongo.connect(mongoUri, function (error, databaseConnection) {
		if (!error) {
        	db = databaseConnection;
    	} else {
    		console.log(error);
    	}
});


/* ***** Begin Route Definitions ***** */
app.post('/submit', cors(), function(req, resp) {
	/* POST route to submit scores to the global score database. */
	/* Will include validation of the received scores so no 1337 h4x0rs cheat */
});

app.get('/high-scores', cors(), function(req, resp) {
	/* GET route to get back global high scores data available to everyone. */
	/* Content returned in JSON format to be used by client to render nicely. */
});
