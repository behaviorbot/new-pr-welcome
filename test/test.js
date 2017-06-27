var assert = require('assert');
var robot = require('probot');
var expect = require('expect');
var main = require('../index.js');

describe('robot.on', function () {
    describe('pull_request.opened', function () {
        describe('getWelcomeFile', () => {
            let github;
            
            beforeEach(() => {
                event = {
                    payload: JSON.parse(JSON.stringify(require('./events/test_payload.json')))
                },
                
                github = {
                    repos: {
                        getContent: expect.createSpy().andReturn(Promise.resolve({
                            content: new Buffer('Congrats on opening your first PR!').toString('base64')
                      }))
                    }
                },

                getFileEvent = {
                    payload: {
                        repository: {
                            name: 'testing-things',
                            owner: {
                                login: 'hiimbex'}
                        }
                    }
                };
            });
            it('returns a welcome file', async () => {
                console.log(typeof main);
                console.log(robot);
                const welcomeFile = await main(robot)getWelcomeFile();
                expect(welcomeFile).toExist();
                expect(context.github.repos.getContent).toHaveBeenCalledWith({
                    owner: 'hiimbex',
                    repo: 'testing-things',
                    path: 'new-pr-welcome.md'
                });
            })
        })
        // it('should welcome new users when they open their first PR', function () {
        //     probot = robot();
        // })
    })
})
