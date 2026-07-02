import { addComment, extractIssueKeys, transitionIssue } from './jira-client.mjs';

function parseIssueKeys() {
  const fromEnv = String(process.env.JIRA_ISSUE_KEYS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (fromEnv.length > 0) {
    return [...new Set(fromEnv)];
  }

  return extractIssueKeys(process.env.JIRA_SOURCE_TEXT || '');
}

function requireJiraEnvironment() {
  const required = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN'];
  const missing = required.filter((name) => !String(process.env[name] || '').trim());
  if (missing.length) {
    throw new Error(`Missing required Jira environment variables: ${missing.join(', ')}`);
  }
}

function buildVerificationComment(state) {
  const lines = [
    `Repo: ${process.env.GITHUB_REPOSITORY || 'unknown-repository'}`,
    `Branch: ${process.env.GITHUB_REF_NAME || 'unknown-branch'}`,
    `Commit: ${process.env.GITHUB_SHA || 'unknown-commit'}`,
    `CI Run: ${process.env.GITHUB_RUN_URL || 'Not available'}`,
  ];

  if (state === 'FAIL') {
    return [
      ...lines,
      'Test Status: FAIL',
      'Created by automation for Software Verification workflow.',
      'Fixer must create bugfix branch and reference Jira ID in commit message.',
    ].join('\n');
  }

  if (state === 'DONE') {
    return [...lines, 'Test Status: PASS', 'Status: MERGED -> moving to Jira DONE'].join('\n');
  }

  return [...lines, `Status: ${state || 'UPDATE'}`].join('\n');
}

async function main() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const state = (process.argv[2] || process.env.JIRA_TARGET_STATE || '').toUpperCase();
  const issueKeys = parseIssueKeys();

  requireJiraEnvironment();

  if (issueKeys.length === 0) {
    console.log('No Jira issue keys found. Skipping sync.');
    return;
  }

  console.log(`Detected branch: ${process.env.GITHUB_REF_NAME || '<none>'}`);
  console.log(`Detected state: ${state || '<none>'}`);
  console.log(`Detected issue keys: ${issueKeys.join(', ')}`);

  for (const issueKey of issueKeys) {
    await addComment({
      baseUrl,
      email,
      apiToken,
      issueKey,
      comment: buildVerificationComment(state),
    });

    if (state === 'FAIL') {
      console.log(`Commented failure on issue key: ${issueKey}`);
      continue;
    }

    if (state === 'DONE') {
      const target = process.env.JIRA_TRANSITION_DONE || 'DONE';
      const result = await transitionIssue({ baseUrl, email, apiToken, issueKey, transitionName: target });
      console.log(`Transitioned issue key: ${issueKey}`);
      console.log(`Target status: ${target}`);
      console.log(`Transition result: ${JSON.stringify(result)}`);
    }
  }

  console.log(JSON.stringify({ state, issueKeys }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
