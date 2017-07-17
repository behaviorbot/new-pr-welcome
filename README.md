# new-pr-welcome

> a GitHub App built with [probot](https://github.com/probot/probot) that welcomes new users when they open their first pull request. You can use this welcome message to provide links to resources like the contributing guidelines, code of conduct, etc. It should be located in a `.github/config.yml`

<img width="802" alt="screen shot 2017-07-07 at 10 40 26 am" src="https://user-images.githubusercontent.com/13410355/28288851-679f582a-6af5-11e7-8dd8-b85b6c33e16b.png">

## Usage

1. Install the bot on the intended repositories. The plugin requires the following **Permissions and Events**:
- Pull requests: **Read & Write**
  - [x] check the box for **Pull Request** events
2. Add a `.github/config.yml` file that contains the contents you would like to reply within an `newPRWelcomeComment`
```yml
# Configuration for new-pr-welcome - https://github.com/behaviorbot/new-pr-welcome

# Comment to be posted to on PRs from first time contributors in your repository
newPRWelcomeComment: >
  Thanks for opening this pull request! Pleas check out our contributing guidelines here: example.md
```

## Setup

```
# Install dependencies
npm install

# Run the bot
npm start
```

See [the probot deployment docs](https://github.com/probot/probot/blob/master/docs/deployment.md) if you would like to run your own instance of this plugin.
