'use strict';

const 
	express = require('express'),
	app = express(),
	tournamentService = require('./services/tournaments');

app.get('/', async (req, res) => {
	const response = await tournamentService.getTournamentIdList();
	console.log(response.data);
})

module.exports = app;