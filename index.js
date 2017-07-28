const yaml = require('js-yaml');

module.exports = robot => {
    robot.on('pull_request.opened', receive);
    async function receive(context) {
        const userLogin = context.payload.pull_request.user.login;
        const repoOwnerLogin = context.payload.repository.owner.login;
        const repoName = context.payload.repository.name;

        const github = await robot.auth(context.payload.installation.id);
        // Get all issues for repo with user as creator
        const response = await github.issues.getForRepo(context.repo({
            owner: repoOwnerLogin,
            repo: repoName,
            state: 'all',
            creator: userLogin
        }));

        const countPR = response.data.filter(data => data.pull_request);
        if (countPR.length === 1) {
            let config;
            // Get the repo's template for response and post it as a comment
            try {
                const options = context.repo({path: '.github/config.yml'});
                const res = await context.github.repos.getContent(options);
                config = yaml.safeLoad(Buffer.from(res.data.content, 'base64').toString()) || {};
            } catch (err) {
                if (err.code !== 404) {
                    throw err;
                }
            }
            context.github.issues.createComment(context.issue({body: config.newPRWelcomeComment}));
        }
    }
};
