'use strict';

const
	utils = require('#shared/utils'),
	mocks = {};

describe('service matches', () => {
	beforeEach(() => {
		jest.mock('axios', () => {
			return {
				get: jest.fn()
			}
		});
		jest.mock('#services', () => {
			return {
				Tournaments: {
					getTournamentInfoList: jest.fn()
				},
				Utils: {
					sortCollectionWithMergeAlgorithm: jest.fn()
				}
			}
		});
		mocks.axios = require('axios');
		mocks.service = require('#services');
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getMatchesListSorted', () => {
		// GIVEN

		it('should return a sorted list of matches for the tournaments available', async () => {
			const
				tournamentInfo = [
					{ id: 1, name: 'tournament_1' },
					{ id: 2, name: 'tournament_2' },
					{ id: 3, name: 'tournament_3' }
				],
				matchList = {},
				httpResulsList = [];

			for (let index = 0; index < 11; index++) {
				matchList[index] = {
					id: 1,
					unusefulData: true,
					comment: `match_${index}`,
					time: {
						time: '12:00',
						date: `${index}/${index}/2021`,
						uts: 100 + index
					},
					teams: {
						away: { name: 'team 1' },
						home: { name: 'team 2' }
					},
					score: { away: 0, home: 1, winner: 'home' }
				};
			};

			for (let index = 0; index < tournamentInfo.length; index++) {
				httpResulsList.push({
					data: {
						doc: [{
							data: {
								matches: matchList
							}
						}]
					}
				})
			};

			const matchListByTournament = {
				'tournament_1': httpResulsList[0].data.doc[0].data.matches,
				'tournament_2': httpResulsList[1].data.doc[1].data.matches,
				'tournament_3': httpResulsList[2].data.doc[2].data.matches
			};

			mocks.service.Tournaments.getTournamentInfoList.mockResolvedValue(tournamentInfo);
			mocks.axios.get.mockResolvedValueOnce(httpResulsList[0]);
			mocks.axios.get.mockResolvedValueOnce(httpResulsList[1]);
			mocks.axios.get.mockResolvedValueOnce(httpResulsList[2]);
			mocks.service.Utils.sortCollectionWithMergeAlgorithm.mockReturnedValueOnce(matchListByTournament[0]);
			mocks.service.Utils.sortCollectionWithMergeAlgorithm.mockReturnedValueOnce(matchListByTournament[1]);
			mocks.service.Utils.sortCollectionWithMergeAlgorithm.mockReturnedValueOnce(matchListByTournament[2]);

			// WHEN
			const result = mocks.service.Matches.getMatchesListSorted();

			// THEN
			expect(mocks.service.Tournaments.getTournamentInfoList).toHaveBeenCalledTimes(1);
			expect(mocks.service.Tournaments.getTournamentInfoList).toHaveBeenCalledWith();
			expect(mocks.axios.get).toHaveBeenCalledTimes(3);
			expect(mocks.axios.get).toHaveBeenNthCalledWith(1, utils.MATCHES_LINK(1));
			expect(mocks.axios.get).toHaveBeenNthCalledWith(2, utils.MATCHES_LINK(2));
			expect(mocks.axios.get).toHaveBeenNthCalledWith(3, utils.MATCHES_LINK(3));
			expect(mocks.service.Utils.sortCollectionWithMergeAlgorithm).toHaveBeenCalledTimes(3);
			expect(mocks.service.Utils.sortCollectionWithMergeAlgorithm).toHaveBeenNthCalledWith(1, Object.values(matchListByTournament['tournament_1']), 'time.uts', order);
			expect(mocks.service.Utils.sortCollectionWithMergeAlgorithm).toHaveBeenNthCalledWith(2, Object.values(matchListByTournament['tournament_2']), 'time.uts', order);
			expect(mocks.service.Utils.sortCollectionWithMergeAlgorithm).toHaveBeenNthCalledWith(3, Object.values(matchListByTournament['tournament_3']), 'time.uts', order);
		});

	});
});