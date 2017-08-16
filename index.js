module.exports = robot => {
    robot.on('pull_request.opened', receive);
    async function receive(context) {
        // Get all issues for repo with user as creator
        const response = await context.github.issues.getForRepo(context.repo({
            state: 'all',
            creator: context.payload.pull_request.user.login
        }));

        const countPR = response.data.filter(data => data.pull_request);
        if (countPR.length === 1) {
            try {
                const config = await context.config('config.yml');
                if (config.newPRWelcomeComment) {
                    context.github.issues.createComment(context.issue({body: config.newPRWelcomeComment}));
                }
            } catch (err) {
                if (err.code !== 404) {
                    throw err;
                }
            }
        }
    }
};
