import getLeaderboard from './Leaderboard';

describe('Leaderboard testing', () => {

	test('testing ', async () => {
		await expect(getLeaderboard()).resolves.toBe({});
	});

});
