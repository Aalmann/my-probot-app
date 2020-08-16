// Checks API example
// See: https://developer.github.com/v3/checks/ to learn more

const issueCommentAdded = require('./issue-comment-added');

/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  app.on(['check_suite.requested', 'check_run.rerequested'], check)
  app.on('issue_comment.created', issueCommentAdded)
  app.on('pull_request.edited', check_while_PR_created)
  app.on('issues.edited', async context => {
    const params = context.issue({ body: 'Thanks for editing this issue.' })

    // Post a comment on the issue
    return context.github.issues.createComment(params)
  })
  app.on('check_run.completed', async context => {
    app.log(context)
  })
  app.on('issue_comment.edited', async context => {
    if (!context.isBot) {
      const params = context.issue({ body: 'TYou have edited one comment.' })

      return context.github.issues.createComment(params)
    }
  })
  
  app.on('pull_request.opened', async context => {
    if (!context.isBot) {
      const params = context.issue({ body: 'Thanks for creating this awesome PR.' })

      return context.github.issues.createComment(params)
    }
  })
  app.on('issues.opened', async context => {
    // `context` extracts information from the event, which can be passed to
    // GitHub API calls. This will return:
    //   { owner: 'yourname', repo: 'yourrepo', number: 123, body: 'Hello World! }
    const params = context.issue({ body: 'Hello World again!' })

    // Post a comment on the issue
    return context.github.issues.createComment(params)
  })

  async function rest (context) {
    context.log({ event: context.event, action: context.payload.action })
    app.log(context)
  }
  async function check (context) {
    const startTime = new Date()

    // Do stuff
    const { head_branch: headBranch, head_sha: headSha } = context.payload.check_suite
    // Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}
    return context.github.checks.create(context.repo({
      name: 'My app!',
      head_branch: headBranch,
      head_sha: headSha,
      status: 'completed',
      started_at: startTime,
      conclusion: 'success',
      completed_at: new Date(),
      output: {
        title: 'Probot check!',
        summary: 'The check has passed!'
      }
    }))
  }
  async function check_while_PR_created (context) {
    const startTime = new Date()

    // Do stuff
    const { ref: headBranch, sha: headSha } = context.payload.pull_request.head
    // Probot API note: context.repo() => {username: 'hiimbex', repo: 'testing-things'}
    return context.github.checks.create(context.repo({
      name: 'This checkwas created with the PR',
      head_branch: headBranch,
      head_sha: headSha,
      status: 'completed',
      started_at: startTime,
      conclusion: 'success',
      completed_at: new Date(),
      output: {
        title: 'Probot check created with PR',
        summary: 'The check has passed!'
      }
    }))
  }
  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
