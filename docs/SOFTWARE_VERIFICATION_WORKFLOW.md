
# Software Verification CI/CD and Jira Workflow

## Scope

The current pipeline verifies the existing .NET build, existing unit tests, and Postman API integration tests. WhiteBox Testing is not implemented or created by this workflow.

Test reporting is implemented around generic test-suite outcomes and log files. A future test suite can be integrated by adding its outcome and log source without changing the Jira payload, description, retry, or comment architecture.

## Required GitHub Actions secrets

- `JIRA_BASE_URL`
- `JIRA_EMAIL`
- `JIRA_API_TOKEN`
- `JIRA_PROJECT_KEY`

Optional secrets:

- `JIRA_REPORTER_ACCOUNT_ID`: sets Jira reporter by Atlassian accountId.
- `JIRA_DEFAULT_ASSIGNEE_ACCOUNT_ID`: assigns the automatically created Bug.
- `JIRA_COMPONENT_NAME`: do not configure this unless the matching component is confirmed to exist in the Jira project.

Never commit Jira tokens or a local `.env` file.

## Verification flow

`feature branch -> Build/Unit/API test -> CI fail -> Jira Bug TODO -> assign fixer -> bugfix branch -> PR -> CI pass -> merge main -> Jira DONE`

A failed feature-branch run creates a Bug linked to the Jira ID in the branch name. The Bug includes branch, commit, actor, failed suite, expected/actual result, short error log, CI URL, priority, due date, labels, and suggested remediation.

A successful run publishes a GitHub Actions job summary containing:

- Test Status: PASS
- Branch and commit
- Service
- Build/Unit/API test summary
- UTC date/time

## Branch and commit conventions

Feature and fix branches must reference a Jira ID, for example `feature/ED-29-sales-validation` or `fix/ED-41-auth-timeout`.

Use one of these commit formats:

- `ED-xx fix: <short description>`
- `ED-xx test: <short description>`
- `ED-xx ci: <short description>`

The fixer must reference the Jira ID in commits and the pull request so the Jira issue can be checked against repository history.

## Jira identity fallback

When `JIRA_REPORTER_ACCOUNT_ID` is absent, the issue is created by the Jira account associated with `JIRA_EMAIL` and `JIRA_API_TOKEN`; no reporter field is hard-coded.

When reporter or assignee is rejected with HTTP 400, automation logs the Jira response body and retries once without both optional identity fields. The CI actor/reporter context remains recorded in the description and comment.

When `JIRA_DEFAULT_ASSIGNEE_ACCOUNT_ID` is absent, the issue remains unassigned unless Jira project defaults apply.
