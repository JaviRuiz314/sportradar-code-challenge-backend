'use strict';

const
	_ = require('lodash'),
	httpRequestService = require('#services/httpRequestService'),
	utils = require('#shared/utils');
	

async function getTournamentsList() {
	const
		tournamentInfo = await httpRequestService.createAHTTPRequest('get', utils.TOURNAMENTS_LINK),
		apiData = _.get(tournamentInfo, 'data.doc');

	return _.get(apiData[0], 'data.tournaments');
}

async function getTournamentInfoList() {
	const tournamentList = await getTournamentsList();
	return tournamentList.map(tournament => {
		return {
			id: tournament._tid,
			name: tournament.name
		}
	});
}

module.exports = {
	getTournamentInfoList
}