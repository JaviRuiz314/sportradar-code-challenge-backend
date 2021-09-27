'use strict';
const
	utils = require('#shared/utils'),
	mocks = {};

describe('services tournaments', () => {
	beforeEach(() => {
		jest.mock('axios', () => {
			return {
				get: jest.fn()
			}
		});

		mocks.axios = require('axios');
		mocks.service = require('#services');
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getTournamentInfoList', () => {
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
				parsedResponse = [
					{
					id: 1,
					name: 'tournament_1'
				}, {
					id: 2,
					name: 'tournament_2'
				}]

			mocks.axios.get.mockResolvedValue(httpResponse);

			// WHEN
			const tournamentIdList = await mocks.service.Tournaments.getTournamentInfoList();

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
			await expect(mocks.service.Tournaments.getTournamentInfoList()).rejects.toThrowError(error);

			// THEN
			expect(mocks.axios.get).toHaveBeenCalledTimes(1);
			expect(mocks.axios.get).toHaveBeenCalledWith(utils.TOURNAMENTS_LINK);
		});
	})
});