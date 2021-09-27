'use strict';
const mocks = {};

let
	send,
	req = {},
	res = {};

describe('controller matches', () => {
	beforeEach(() => {
		jest.mock('#services/matchesService', () => {
			return {
					getMatchesListSorted: jest.fn()
			}
		});

		mocks.matchesService = require('#services/matchesService');
		mocks.matchesController = require('#controllers/matchesController');

		send = jest.fn();
		res = { status: jest.fn().mockReturnValue({ send }) };
	});
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe('getMatchesFromDataServer', () => {
		it('should call the correct methods to retrieve the data of the last five matches', async () => {
			// GIVEN
			const listOfMatches = {
				tournamentA: [{ id: 1 }, { id: 2 }],
				tournamentB: [{ id: 3 }, { id: 4 }, { id: 5 }]
			};

			mocks.matchesService.getMatchesListSorted.mockResolvedValue(listOfMatches);

			// WHEN
			await mocks.matchesController.getMatchesFromDataServer(req, res);

			// THEN
			expect(mocks.matchesService.getMatchesListSorted).toHaveBeenCalledTimes(1);
			expect(mocks.matchesService.getMatchesListSorted).toHaveBeenCalledWith();
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(send).toHaveBeenCalledTimes(1);
			expect(send).toHaveBeenCalledWith(listOfMatches);
		});
		it('should throw an unexpected error', async () => {
			// GIVEN
			const error = new Error('unexpected error');

			mocks.matchesService.getMatchesListSorted.mockRejectedValue(error);

			// WHEN
			await mocks.matchesController.getMatchesFromDataServer(req, res);

			// THEN
			expect(mocks.matchesService.getMatchesListSorted).toHaveBeenCalledTimes(1);
			expect(mocks.matchesService.getMatchesListSorted).toHaveBeenCalledWith();
			expect(res.status).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(500);
			expect(send).toHaveBeenCalledTimes(1);
			expect(send).toHaveBeenCalledWith(error);			
		});
	})
});