'use strict';

const
	express = require('express'),
	app = express.Router(),
	controllers = require('#controllers');

app.get('/getlatestmatchesbytournament', async (req, res) => {
	await controllers.Matches.getMatchesFromDataServer(req, res);
});

module.exports = app;