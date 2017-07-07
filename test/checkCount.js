const expect = require('expect');
const checkCount = require('../lib/checkCount');
const succIssueRes = require('./events/succIssueRes');
const failIssueRes = require('./events/failIssueRes');

describe('checkCount', () => {
    it('it succeeds because it is a user\'s first PR', async () => {
        expect(checkCount.PRCount(succIssueRes)).toBe(true);
    });

    it('it fails because it is not a user\'s first PR', async () => {
        expect(checkCount.PRCount(failIssueRes)).toBe(false);
    });
});
