import { addComment, extractIssueKeys, transitionIssue } from './jira-client.mjs';

function parseIssueKeys() {
  const rawIssueKeys = String(process.env.JIRA_ISSUE_KEYS || '').trim();
  if (rawIssueKeys) {
    const issueKeys = extractIssueKeys(rawIssueKeys);
    if (issueKeys.length === 0) {
      throw new Error('JIRA_ISSUE_KEYS was provided but contains no valid Jira issue key. Expected a value such as ED-33.');
    }
    return issueKeys;
  }

  return extractIssueKeys(process.env.JIRA_SOURCE_TEXT || '');
}

function requireJiraEnvironment() {
  const required = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN', 'JIRA_PROJECT_KEY'];
  const missing = required.filter((name) => !String(process.env[name] || '').trim());
  if (missing.length) {
    throw new Error(`Missing required Jira environment variables: ${missing.join(', ')}`);
  }
}

function buildVerificationComment(state, issueKey) {
  const branchType = process.env.JIRA_BRANCH_TYPE || 'other';
  const lines = [
    `Test Execution Result: ${state}`,
    `Repo: ${process.env.GITHUB_REPOSITORY || 'unknown-repository'}`,
    `Branch: ${process.env.GITHUB_REF_NAME || 'unknown-branch'}`,
    `Commit: ${process.env.GITHUB_SHA || 'unknown-commit'}`,
    `Actor: ${process.env.GITHUB_ACTOR || 'unknown-actor'}`,
    `CI Run: ${process.env.GITHUB_RUN_URL || 'Not available'}`,
    `Branch Type: ${branchType}`,
    `Jira Issue: ${issueKey}`,
  ];

  if (state === 'PASS') {
    return [
      ...lines,
      'Status: PASS',
      'Note:',
      '- CI/build/test completed successfully.',
      '- If this is a bugfix branch, create PR and merge to main.',
      '- Jira issue should only move DONE after PR merge.',
    ].join('\n');
  }

  if (state === 'FAIL') {
    return [
      ...lines,
      'Status: FAIL',
      'Created by automation for Software Verification workflow.',
      'Fixer must create bugfix branch and reference Jira ID in commit message.',
    ].join('\n');
  }

  if (state === 'DONE') {
    return [...lines, 'Status: PASS', 'Status update: MERGED -> moving to Jira DONE'].join('\n');
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
    console.warn('No valid Jira issue key was found. Jira synchronization was skipped.');
    return;
  }

  console.log(`Detected branch type: ${process.env.JIRA_BRANCH_TYPE || 'other'}`);
  console.log(`Detected state: ${state || '<none>'}`);
  console.log(`Valid Jira issue key count: ${issueKeys.length}`);

  for (const issueKey of issueKeys) {
    await addComment({
      baseUrl,
      email,
      apiToken,
      issueKey,
      comment: buildVerificationComment(state, issueKey),
    });

    if (state === 'FAIL') {
      console.log('FAIL comment added to the Jira issue.');
      continue;
    }

    if (state === 'PASS') {
      const branchType = process.env.JIRA_BRANCH_TYPE || 'other';
      if (branchType === 'feature' || branchType === 'chore') {
        const target = process.env.JIRA_TRANSITION_IN_PROGRESS || 'In Progress';
        const result = await transitionIssue({ baseUrl, email, apiToken, issueKey, transitionName: target });
        console.log(`PASS comment added; In Progress transition result: ${JSON.stringify(result)}`);
      } else {
        console.log(`PASS comment added for ${branchType} branch; Jira status remains unchanged until PR merge.`);
      }
      continue;
    }

    if (state === 'DONE') {
      const target = process.env.JIRA_TRANSITION_DONE || 'DONE';
      const result = await transitionIssue({ baseUrl, email, apiToken, issueKey, transitionName: target });
      console.log(`Done transition result: ${JSON.stringify(result)}`);
    }
  }

  console.log(JSON.stringify({ state, issueCount: issueKeys.length }, null, 2));
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
