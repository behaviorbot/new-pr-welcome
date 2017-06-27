module.exports = robot => {
  robot.on('pull_request.opened', async context => {
    if (!context.payload.repository.owner || !context.payload.pull_request.user.id || !context.payload.repository.name) {
        issue = (await context.github.pull_request.get(context.issue())).data;
    }

    const user_login = context.payload.pull_request.user.login;
    const repo_owner_id = context.payload.repository.owner.login;
    const repo_name = context.payload.repository.name;
    
    async function getWelcomeFile() {
        const options = context.repo({path: '.github/new-pr-welcome.md'});
        const res = await context.github.repos.getContent(options);
        return new Buffer(res.data.content, 'base64').toString();
    }
    const template = getWelcomeFile();

    const github = await robot.auth(context.payload.installation.id);
    const response = await github.issues.getForRepo(context.repo({
        owner: repo_owner_id,
        repo: repo_name,
        state: "all",
        creator: user_login
    }));

    var count_pr = 0;
    //check for issues that are also PRs
    for (i = 0; i < response.data.length; i++) {
        if ((response.data[i]).pull_request) {
            count_pr += 1;
        }
        //exit loop if more than one PR
        if (count_pr > 1) {
            break;
        }
    }
    //check length of response to make sure its only one pr
    if (count_pr === 1) {
        context.github.issues.createComment(context.issue({body: template}));
    }
  });
};
