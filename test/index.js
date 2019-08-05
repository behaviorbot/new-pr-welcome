const expect = require('expect');
const {Application} = require('probot');
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

        github = {
            repos: {
                getContents: expect.createSpy().andReturn(Promise.resolve({
                    data: {
                        content: Buffer.from(`newPRWelcomeComment: >\n  Hello World!`).toString('base64')
                    }
                }))
            },
            issues: {
                getForRepo: expect.createSpy().andReturn(Promise.resolve(
                    succIssueRes
                )),
                createComment: expect.createSpy()
            }
        };

        app.auth = () => Promise.resolve(github);
    });

    describe('new-pr-welcome', () => {
        it('posts a comment because it is a user\'s first PR', async () => {
            await app.receive(succeedEvent);

            expect(github.issues.getForRepo).toHaveBeenCalledWith({
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
        beforeEach(() => {
            github.issues.getForRepo = expect.createSpy().andReturn(Promise.resolve(failIssueRes));
        });

        it('does not post a comment because it is not the user\'s first PR', async () => {
            await app.receive(failEvent);

            expect(github.issues.getForRepo).toHaveBeenCalledWith({
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
