const expect = require('expect');
const {Application} = require('probot');
const {GitHubAPI} = require('probot/lib/github');
const succeedEvent = require('./events/succeedEvent');
const failEvent = require('./events/failEvent');
const succIssueRes = require('./events/succIssueRes');
const failIssueRes = require('./events/failIssueRes');
const plugin = require('..');

describe('new-pr-welcome', () => {
    let app;
    let github;

    beforeEach(() => {
        app = new Application();
        plugin(app);
        github = new GitHubAPI();
        app.auth = () => Promise.resolve(github);
    });

    function makeResponse(msg) {
        return Promise.resolve({data: {content: Buffer.from(msg).toString('base64')}});
    }

    describe('new-pr-welcome', () => {
        it('posts a comment because it is a user\'s first PR', async () => {
            expect.spyOn(github.repos, 'getContents').andReturn(makeResponse(`newPRWelcomeComment: >\n  Hello World!`));
            expect.spyOn(github.issues, 'listForRepo').andReturn(Promise.resolve(succIssueRes));
            expect.spyOn(github.issues, 'createComment');

            await app.receive(succeedEvent);

            expect(github.issues.listForRepo).toHaveBeenCalledWith({
                owner: 'hiimbex',
                repo: 'testing-things',
                state: 'all',
                creator: 'hiimbex-testing'
            });
            expect(github.repos.getContents).toHaveBeenCalledWith({
                owner: 'hiimbex',
                repo: 'testing-things',
                path: '.github/config.yml'
            });
            expect(github.issues.createComment).toHaveBeenCalled();
        });
    });

    describe('new-pr-welcome fail', () => {
        it('does not post a comment because it is not the user\'s first PR', async () => {
            expect.spyOn(github.repos, 'getContents').andReturn(makeResponse(`newPRWelcomeComment: >\n  Hello World!`));
            expect.spyOn(github.issues, 'listForRepo').andReturn(Promise.resolve(failIssueRes));
            expect.spyOn(github.issues, 'createComment');

            await app.receive(failEvent);

            expect(github.issues.listForRepo).toHaveBeenCalledWith({
                owner: 'hiimbex',
                repo: 'testing-things',
                state: 'all',
                creator: 'hiimbex'
            });
            expect(github.repos.getContents).toNotHaveBeenCalled();
            expect(github.issues.createComment).toNotHaveBeenCalled();
        });
    });
});
