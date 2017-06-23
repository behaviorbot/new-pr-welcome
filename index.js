module.exports = robot => {
  robot.on('pull_request', async context => {
    if (!context.payload.repository.owner || !context.payload.pull_request.user.id || !context.payload.repository.name) {
        issue = (await context.github.pull_request.get(context.issue())).data;
    }

    const user_login = context.payload.pull_request.user.login;
    const repo_owner_id = context.payload.repository.owner.login;
    const repo_name = context.payload.repository.name;

    const options = context.repo({path: '.github/new-pr-welcome.md'});
    const response = await context.github.repos.getContent(options);
    const template = new Buffer(response.data.content, 'base64').toString();

    var GitHubApi = require("github");
    
    var github = new GitHubApi({
        debug: true,
    });
    
    github.authenticate({
        type: "oauth",
        key: process.env.CLIENT_ID,
        secret: process.env.CLIENT_SECRET
    });
    
    github.issues.getForRepo({
        owner: repo_owner_id,
        repo: repo_name,
        state: "all",
        creator: user_login
    }, function(error, response) {
        if (error) {
            console.log(error.toJSON());
        } else {
            var count_pr = 0
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
        }
    });
  });
};
