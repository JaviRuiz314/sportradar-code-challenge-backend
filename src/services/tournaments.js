'use strict';

const
	axios = require('axios'),
	_ = require('lodash');

async function getTournamentsList() {
	const
		tournamentInfo = await axios.get('https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/1/17'),
		apiData = _.get(tournamentInfo, 'data.doc');

	return _.get(apiData[0], 'data.tournaments');
}

async function getTournamentInfoList() {
	const tournamentList = await getTournamentsList();
	return tournamentList.map(tournament => {
		return {
			id: tournament._tid,
			name: tournament.name,
			seasonType: tournament.seasontypename
		}
	});
}

module.exports = {
	getTournamentsList,
	getTournamentInfoList
}