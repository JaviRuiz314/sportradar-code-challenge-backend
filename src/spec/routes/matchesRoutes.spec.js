const
	supertest = require('supertest'),
	server = require('../../server'),
	utilRoutes = require('./utilRoutes'),
	mocks = {};

describe('routes matches', () => {
	beforeEach(() => {
		jest.mock('../../controller', () => {
			return {
				Matches: {
					getMatchesFromDataServer: (req, res) => {
						res.send('getMatchesFromDataServer Ok');
					}
				}
			}
		});

		mocks.routes = utilRoutes.routes;
		mocks.routes.Matches = require('../../routes/matchesRoutes');
		jest.mock('../../routes', () => mocks.routes);
		mocks.app = supertest(server);
	});

	describe('check routes', () => {
		it('it should call getlatestmatchesbytournament', async () => {
			let res = await mocks.app.get('/getlatestmatchesbytournament');

			expect(res.error).toEqual(false);
			expect(res.status).toEqual(200);
			expect(res.text).toEqual('getMatchesFromDataServer Ok');
		});
	});
});