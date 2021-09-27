const
	supertest = require('supertest'),
	utilRoutes = require('./utilRoutes'),
	mocks = {};

let
	server,
	app;

describe('routes matches', () => {
	beforeEach(() => {
		jest.mock('#controllers/matchesController', () => {
			return {
				getMatchesFromDataServer: (req, res) => {
					res.send('getMatchesFromDataServer Ok');
				}
			}
		});

		mocks.routes = utilRoutes.routes;

		mocks.routes.Matches = require('#routes/matchesRoutes');
		jest.mock('#routes', () => mocks.routes);
		server = require('#server'),
		app = supertest(server);
	});

	describe('check routes', () => {
		it('should call getlatestmatchesbytournament', async () => {
			const res = await app.get('/getlatestmatchesbytournament');
			expect(res.error).toEqual(false);
			expect(res.status).toEqual(200);
			expect(res.text).toEqual('getMatchesFromDataServer Ok');
		});
	});
});