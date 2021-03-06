'use strict';

const
	_ = require('lodash'),
	httpRequestService = require('#services/httpRequestService'),
	tournamentService = require('#services/tournamentsService'),
	utilsService = require('#services/utilsService'),
	utils = require('#shared/utils');

async function getMatchesByTournamentId(tournamentsInfoList = []) {
	let matchesData = {};

	await Promise.all(tournamentsInfoList.slice(0).map(async (tournament) => {
		const
			matchListInfo = await httpRequestService.createHTTPRequest(utils.GET_HTTP_METHOD, utils.MATCHES_LINK(tournament.id)),
			apiData = _.get(matchListInfo, 'data.doc');

		if (apiData.length) matchesData[tournament.name] = _.get(apiData[0], 'data.matches');
	}));

	return matchesData;
}

function parseTimeAndDateOfMatches(matchList) {
	return matchList.map(match => {
		return {
			time: {
				time: match.time.time,
				date: match.time.date
			},
			teams: {
				away: match.teams.away.name,
				home: match.teams.home.name
			},
			score: {
				away: match.result.away,
				home: match.result.home
			},
			events: match.comment
		}
	});
}

function orderMatchesByCriteria(matchList, order, limit) {
	const
		sortedData = utilsService.sortCollectionWithMergeAlgorithm(matchList, 'time.uts', order),
		parsedAndsortedList = parseTimeAndDateOfMatches(sortedData.slice(0, limit));

	return parsedAndsortedList;
};

async function getMatchesListSorted(order = utils.ORDER_DESC, limit = 5) {
	const
		tournamentsInfoList = await tournamentService.getTournamentInfoList(),
		matchesListFromDataServer = await getMatchesByTournamentId(tournamentsInfoList),
		orderedMatchesByTournament = {};

	Object.keys(matchesListFromDataServer).forEach(tournament => {
		orderedMatchesByTournament[tournament] = orderMatchesByCriteria(Object.values(matchesListFromDataServer[tournament]), order, limit);
	});

	return orderedMatchesByTournament;
}

module.exports = { getMatchesListSorted }