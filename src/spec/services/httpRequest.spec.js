'use strict';
const mocks = {};

describe('services tournaments', () => {
	beforeEach(() => {
		jest.mock('axios', () => jest.fn());

		mocks.axios = require('axios');
		mocks.httpRequestService = require('#services/httpRequestService');
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('createHTTPRequest', () => {
		it('should create and return an axios request', async () => {
			// GIVEN
			const
				mockedResponse = { test: 'test' },
				test_method = 'test_method',
				test_url = 'test_url';

			mocks.axios.mockResolvedValue(mockedResponse);

			// WHEN
			const response = await mocks.httpRequestService.createHTTPRequest(test_method, test_url);

			// THEN
			expect(mocks.axios).toHaveBeenCalledTimes(1);
			expect(mocks.axios).toHaveBeenCalledWith({method: test_method, url: test_url});
			expect(response).toEqual(mockedResponse);
		});
		it('should throw an unexpected error', async () => {
			// GIVEN
			const
				error = new Error('unexpected error'),
				test_method = 'test_method',
				test_url = 'test_url';

			mocks.axios.mockRejectedValue(error);

			// WHEN
			await expect(mocks.httpRequestService.createHTTPRequest(test_method, test_url)).rejects.toThrowError(error);

			// THEN
			expect(mocks.axios).toHaveBeenCalledTimes(1);
			expect(mocks.axios).toHaveBeenCalledWith({method: test_method, url: test_url});
		});
	})
});