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
		jest.mock('#services/utilsService', () => {
			return {
				sortCollectionWithMergeAlgorithm: jest.fn()
			}
		});
		jest.mock('#services/tournamentsService', () => {
			return {
				getTournamentInfoList: jest.fn()
			}
		});
		mocks.axios = require('axios');
		mocks.tournamentsService = require('#services/tournamentsService');
		mocks.utilsService = require('#services/utilsService');
		mocks.matchesService = require('#services/matchesService');
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getMatchesListSorted', () => {
		// GIVEN

		it('should return a sorted list of matches for the tournaments available', async () => {
			const
				order = utils.ORDER_DESC,
				tournamentInfo = [
					{ id: 1, name: 'tournament_1' },
					{ id: 2, name: 'tournament_2' },
					{ id: 3, name: 'tournament_3' }
				],
				matchList = [],
				matchParsedList = [],
				httpResulsList = [];

			for (let index = 0; index < 11; index++) {
				matchList.push({
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
					result: { away: 0, home: 1, winner: 'home' }
				});

				matchParsedList.push({
					events: `match_${index}`,
					time: {
						time: '12:00',
						date: `${index}/${index}/2021`,
					},
					teams: {
						away: 'team 1' ,
						home: 'team 2' 
					},
					score: { away: 0, home: 1 }
				})
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

			const
				matchListByTournament = {
					'tournament_1': httpResulsList[0].data.doc[0].data.matches,
					'tournament_2': httpResulsList[1].data.doc[0].data.matches,
					'tournament_3': httpResulsList[2].data.doc[0].data.matches
				},
				matchListByTournamentParsed = {
					'tournament_1': matchParsedList.slice(0,5),
					'tournament_2': matchParsedList.slice(0,5),
					'tournament_3': matchParsedList.slice(0,5)
				};

			mocks.tournamentsService.getTournamentInfoList.mockResolvedValue(tournamentInfo);
			mocks.axios.get.mockResolvedValueOnce(httpResulsList[0]);
			mocks.axios.get.mockResolvedValueOnce(httpResulsList[1]);
			mocks.axios.get.mockResolvedValueOnce(httpResulsList[2]);
			mocks.utilsService.sortCollectionWithMergeAlgorithm.mockReturnValueOnce(matchListByTournament['tournament_1']);
			mocks.utilsService.sortCollectionWithMergeAlgorithm.mockReturnValueOnce(matchListByTournament['tournament_2']);
			mocks.utilsService.sortCollectionWithMergeAlgorithm.mockReturnValueOnce(matchListByTournament['tournament_3']);
			// WHEN
			const result = await mocks.matchesService.getMatchesListOrdered();

			// THEN
			expect(mocks.tournamentsService.getTournamentInfoList).toHaveBeenCalledTimes(1);
			expect(mocks.tournamentsService.getTournamentInfoList).toHaveBeenCalledWith();
			expect(mocks.axios.get).toHaveBeenCalledTimes(3);
			expect(mocks.axios.get).toHaveBeenNthCalledWith(1, utils.MATCHES_LINK(1));
			expect(mocks.axios.get).toHaveBeenNthCalledWith(2, utils.MATCHES_LINK(2));
			expect(mocks.axios.get).toHaveBeenNthCalledWith(3, utils.MATCHES_LINK(3));
			expect(mocks.utilsService.sortCollectionWithMergeAlgorithm).toHaveBeenCalledTimes(3);
			expect(mocks.utilsService.sortCollectionWithMergeAlgorithm).toHaveBeenNthCalledWith(1, Object.values(matchListByTournament['tournament_1']), 'time.uts', order);
			expect(mocks.utilsService.sortCollectionWithMergeAlgorithm).toHaveBeenNthCalledWith(2, Object.values(matchListByTournament['tournament_2']), 'time.uts', order);
			expect(mocks.utilsService.sortCollectionWithMergeAlgorithm).toHaveBeenNthCalledWith(3, Object.values(matchListByTournament['tournament_3']), 'time.uts', order);
			expect(result).toEqual(matchListByTournamentParsed);
		});

	});
	it('should reject an unexpected error', async () => {
		// GIVEN
		const error = new Error('unexpected error');

		mocks.tournamentsService.getTournamentInfoList.mockRejectedValue(error);

		// WHEN
		await expect(mocks.matchesService.getMatchesListOrdered()).rejects.toThrowError(error);

		// THEN
		expect(mocks.tournamentsService.getTournamentInfoList).toHaveBeenCalledTimes(1);
		expect(mocks.tournamentsService.getTournamentInfoList).toHaveBeenCalledWith();

	});
});