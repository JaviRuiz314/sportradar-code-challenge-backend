'use strict';

const 
	express = require('express'),
	app = express(),
	matchesServices = require('./controllers/matches');

app.get('/', async (req, res) => {
	const response = await matchesServices.getMatchesFromDataServer(req, res);
	console.log(response.data);
})

module.exports = app;