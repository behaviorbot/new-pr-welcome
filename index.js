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

        function checkPRCount(response) {
            let countPR = 0;
            // Check for issues that are pull requests
            for (let i = 0; i < response.data.length; i++) {
                if ((response.data[i]).pull_request) countPR += 1;
                // Return false if more than one PR
                if (countPR > 1) return false;
            }
            return true;
        }

        if (checkPRCount(response)) {
            let template;
            // Get the repo's template for response and post it as a comment
            try {
                const options = context.repo({path: '.github/new-pr-welcome.md'});
                const res = await context.github.repos.getContent(options);
                template = Buffer.from(res.data.content, 'base64').toString();
            } catch(err) {
                template = 'Thanks for opening your first PR here!';
            }
            context.github.issues.createComment(context.issue({body: template}));
        }
    }
};
