'use strict';

const
	_ = require('lodash'),
	axios = require('axios'),
	tournamentService = require('../services/tournaments'),
	utils = require('../shared/utils');

async function getMatchesByTournamentId(tournamentsInfoList = []) {
	let matchesData = {};

	await Promise.all(tournamentsInfoList.slice(0).map(async (tournament) => {
		const
			matchListInfo = await axios.get(utils.MATCHES_LINK(tournament.id)),
			apiData = _.get(matchListInfo, 'data.doc');

		if (apiData.length) matchesData[tournament.name] = _.get(apiData[0], 'data.matches');
	}));

	return matchesData;
}

function parseTimeAndDateOfMatches(matchList) {
	return matchList.map(match => {
		const
			dateParts = match.time.date.split('/').reverse().join(''),
			timeParts = match.time.time.split(':').join('');
		return {
			time: match.time,
			teams: match.teams,
			score: match.result,
			events: match.comment,
			numberDate: +dateParts,
			numberTime: +timeParts
		}
	});
}

function compareDates(firstElement, secondElement) {
	if (firstElement.date === secondElement.date) {
		return firstElement.time - secondElement.time;
	}
	return firstElement.date - secondElement.date;
}

function orderMatchesByCriteria(matchList, order, limit) {
	const
		listedParsed = parseTimeAndDateOfMatches(matchList),
		sortedData = listedParsed.slice().sort((a, b) => {
			if (order === utils.ORDER_ASC) {
				return compareDates(
					{ date: a.numberDate, time: a.numberTime },
					{ date: b.numberDate, time: b.numberTime }
				);
			}
			return compareDates(
				{ date: b.numberDate, time: b.numberTime },
				{ date: a.numberDate, time: a.numberTime }
			);
		});

	return sortedData.slice(0, limit);
};

async function getMatchesListOrdered(order = 'DESC', limit = 5) {
	const
		tournamentsInfoList = await tournamentService.getTournamentInfoList(),
		matchesListFromDataServer = await getMatchesByTournamentId(tournamentsInfoList),
		orderedMatchesByTournament = {};

	Object.keys(matchesListFromDataServer).forEach(tournament => {
		orderedMatchesByTournament[tournament] = orderMatchesByCriteria(Object.values(matchesListFromDataServer[tournament]), order, limit);
	})

	return orderedMatchesByTournament;
}

module.exports = { getMatchesListOrdered }