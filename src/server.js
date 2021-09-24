'use strict';

const 
	express = require('express'),
	app = express(),
	matchesController = require('#controllers/matchesController');

app.get('/', async (req, res) => {
	const response = await matchesController.getMatchesFromDataServer(req, res);
	console.log(response.data);
})

module.exports = app;