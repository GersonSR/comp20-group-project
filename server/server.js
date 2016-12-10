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
	/* 
	 * POST route to submit scores to the global score database. 
	 * Will include validation of the received scores so no 1337 h4x0rs cheat 
	 * Data will be structured in a JSON object (Mongo document) as:
	 *
	 * {
	 * 		username: ,
	 *		game-mode: ,
	 *  	score: ,
	 *		time: ,
	 * }
	 * 
	 * Eventually the scores will be validated to prevent cheating. To do this,
	 * we can employ some client-server encryption/decryption and comparison,
	 * send different data to calculate scores on the server side, or do any
	 * other of a number of things.
	 *
	 * In a later version we may change this data to contain not the raw score,
	 * but Google Directions waypoints info to do all the calculations on the
	 * server. This will make it very hard to cheat, as we're hiding our score
	 * calculation algorithm.
	 *
	 * Usernames will be sanitized to prevent script-based attacks. Ditto for
	 * game-modes. Times will be computed server side.
	 *
	 * game-mode MUST match a valid game mode, e.g. "easy", "hard", "local"...
	 * If not, no data will be stored. Input validation FTW!
	 */

	 /* Get out all request parameters */
	 var username  = req.body.username;
	 var game-mode = req.body.game-mode;
	 var score     = req.body.score;

	 if (username != undefined && game-mode != undefined && score != undefined &&
	 	                         (game-mode === "easy" || game-mode === "hard" ||
	 	                       	  game-mode === "local")) {
	 	username  = username.replace(/[^\w\s]/gi, '');
	 	game-mode = game-mode.replace(/[^\w\s]/gi, '');
	 	score     = Number(score); /* TODO: MAKE SURE THEY AREN'T FILTHY CHEATERS BY CALCULATING SCORE ON SERVER-SIDE */

	 	/* Build document to store in database */
	 	var d = new Date();
	 	var document = {
	 		"username": username,
	 		"game-mode": game-mode,
	 		"score": score,
	 		"time": d.toUTCString(), /* Makes the date and time look reasonable */
	 	};

	 	db.collection('user-data', function(err, coll) {
	 		if (!err) {
	 			var id = coll.insert(document, function(err, saved) {
	 				if (!err) {
	 					resp.send(200);
	 				} else {
	 					resp.send(500);
	 				}
	 			});
	 		} else {
	 			resp.send(500);
	 		}
	 	});
	 } else {
	 	resp.send(200); /* OK; just didn't enter any data */
	 }

});

app.get('/high-scores', cors(), function(req, resp) {
	/* 
	 * GET route to get back global high scores data available to everyone. 
	 * Content returned in JSON format to be used by client to render nicely. 
	 * 
	 * This route will handle sending back to the client global score data,
	 * based on their selections on a form on the scores / statistics page.
	 *
	 * Data is sent back in JSON format for parsing (let the client do all
	 * the nice looking stuff). This allows for a really simple model where
	 * the client is responsible for all the tricky data handling to display
	 * desired content.
	 *
	 * Validation on this route will be on form parameters: Sanitization and
	 * comparison against a fixed set of valid inputs. This of course prevents
	 * script-based attacks and only deals with data we want to be dealt with.
	 */
});

/*
 * Future ideas: Routes to handle the generation of the start/end points
 * to send to the client. This will facilitate better handling of the
 * most important game mechanics, fewer errors due to client-side
 * tomfoolery, and ultimately an experience where the client isn't so packed
 * with stuff for the user to download and run locally.
 */

