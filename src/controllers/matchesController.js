'use strict';

const matchesService = require('#services/matchesService');

async function getMatchesFromDataServer(req, res) {
	try {
		const matchesList = await matchesService.getMatchesListOrdered();
		res.status(200).send(matchesList);
	} catch (error) {
		console.log(`***getMatchesFromDataServer unexpected error: ${error}. Stack: ${error.stack}`);
		res.status(500).send(error);
	}
}

module.exports = {
	getMatchesFromDataServer
}