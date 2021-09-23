'use strict';

const
	_ = require('lodash'),
	axios = require('axios'),
	tournamentService = require('../services/tournaments'),
	utils = require('../shared/utils');

async function getMatchesByTournamentId(tournamentsIdList = []) {
	const matchesData = [];

	await Promise.all(tournamentsIdList.slice(0).map(async (tournamentId) => {
		const
			matchListInfo = await axios.get(utils.MATCHES_LINK(tournamentId)),
			apiData = _.get(matchListInfo, 'data.doc');

		apiData.length && matchesData.push(_.get(apiData[0], 'data.matches'));
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
		tournamentsIdList = await tournamentService.getTournamentIdList(),
		matchesListFromDataServer = await getMatchesByTournamentId(tournamentsIdList);

	return matchesListFromDataServer.map(matchesByTournament => orderMatchesByCriteria(Object.values(matchesByTournament), order, limit));
}

module.exports = { getMatchesListOrdered }