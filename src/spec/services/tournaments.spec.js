'use strict';
const
	utils = require('#shared/utils'),
	mocks = {};

describe('services tournaments', () => {
	beforeEach(() => {
		jest.mock('#services/httpRequestService', () => {
			return {
				createHTTPRequest: jest.fn()
			}
		});

		mocks.httpRequestService = require('#services/httpRequestService');
		mocks.tournamentsService = require('#services/tournamentsService');
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

			mocks.httpRequestService.createHTTPRequest.mockResolvedValue(httpResponse);

			// WHEN
			const tournamentIdList = await mocks.tournamentsService.getTournamentInfoList();

			// THEN
			expect(mocks.httpRequestService.createHTTPRequest).toHaveBeenCalledTimes(1);
			expect(mocks.httpRequestService.createHTTPRequest).toHaveBeenCalledWith(utils.GET_HTTP_METHOD, utils.TOURNAMENTS_LINK);
			expect(tournamentIdList).toEqual(parsedResponse);
		});
		it('should throw an unexpected error', async () => {
			// GIVEN
			const error = new Error('unexpected error');

			mocks.httpRequestService.createHTTPRequest.mockRejectedValue(error);

			// WHEN
			await expect(mocks.tournamentsService.getTournamentInfoList()).rejects.toThrowError(error);

			// THEN
			expect(mocks.httpRequestService.createHTTPRequest).toHaveBeenCalledTimes(1);
			expect(mocks.httpRequestService.createHTTPRequest).toHaveBeenCalledWith(utils.GET_HTTP_METHOD, utils.TOURNAMENTS_LINK);
		});
	})
});