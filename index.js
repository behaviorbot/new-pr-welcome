module.exports = app => {
    app.on('pull_request.opened', receive);
    async function receive(context) {
    // Get all issues for repo with user as creator
        const response = await context.github.issues.listForRepo(context.repo({
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
            } catch (error) {
                if (error.code !== 404) {
                    throw error;
                }
            }
        }
    }
};
