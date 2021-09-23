'use strict';
const
	utils = require('../../shared/utils'),
	mocks = {};

describe('services tournaments', () => {
	beforeEach(() => {
		jest.mock('axios', () => {
			return {
				get: jest.fn()
			}
		});

		mocks.axios = require('axios');
		mocks.tournamentsService = require('../../services/tournaments');
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getTournamentIdList', () => {
		it('should call the correct methods to retrieve the data of the tournaments', async () => {
			// GIVEN
			const
				httpResponse = {
					status: 200,
					data: {
						doc: [{
							data: {
								tournaments: [
									{
										_tid: 1,
										name: 'tournament_1'
									},
									{
										_tid: 2,
										name: 'tournament_2'
									}
								]
							}
						}]
					}
				},
				parsedResponse = [1, 2];

			mocks.axios.get.mockResolvedValue(httpResponse);

			// WHEN
			const tournamentIdList = await mocks.tournamentsService.getTournamentIdList();

			// THEN
			expect(mocks.axios.get).toHaveBeenCalledTimes(1);
			expect(mocks.axios.get).toHaveBeenCalledWith(utils.TOURNAMENTS_LINK);
			expect(tournamentIdList).toEqual(parsedResponse);
		});
		it('should throw an unexpected error', async () => {
			// GIVEN
			const error = new Error('unexpected error');

			mocks.axios.get.mockRejectedValue(error);

			// WHEN
			await expect(mocks.tournamentsService.getTournamentIdList()).rejects.toThrowError(error);

			// THEN
			expect(mocks.axios.get).toHaveBeenCalledTimes(1);
			expect(mocks.axios.get).toHaveBeenCalledWith(utils.TOURNAMENTS_LINK);
		});
	})
});