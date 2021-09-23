'use strict';

const
	TOURNAMENTS_LINK = 'https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/config_tournaments/1/17',
	MATCHES_LINK = (id) => `https://cp.fn.sportradar.com/common/en/Etc:UTC/gismo/fixtures_tournament/${id}/2021`,
	ORDER_DESC = 'DESC',
	ORDER_ASC = 'ASC';

module.exports = {
	TOURNAMENTS_LINK,
	MATCHES_LINK,
	ORDER_DESC,
	ORDER_ASC
}