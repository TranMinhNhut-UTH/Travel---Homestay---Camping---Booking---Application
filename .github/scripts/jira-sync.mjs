import { addComment, extractIssueKeys, transitionIssue } from './jira-client.mjs';

function parseIssueKeys() {
  const fromEnv = String(process.env.JIRA_ISSUE_KEYS || '').split(',').map((item) => item.trim()).filter(Boolean);
  if (fromEnv.length > 0) {
    return [...new Set(fromEnv)];
  }

  const sourceText = process.env.JIRA_SOURCE_TEXT || '';
  return extractIssueKeys(sourceText);
}

async function main() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const state = (process.argv[2] || process.env.JIRA_TARGET_STATE || '').toUpperCase();
  const issueKeys = parseIssueKeys();
  const runUrl = process.env.GITHUB_RUN_URL || '';
  const branchName = process.env.GITHUB_REF_NAME || '';

  if (!baseUrl || !email || !apiToken) {
    throw new Error('Missing required env vars: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN');
  }

  if (issueKeys.length === 0) {
    console.log('No Jira issue keys found. Skipping sync.');
    return;
  }

  const comment = `GitHub Actions ${state || 'UPDATE'} for branch ${branchName}${runUrl ? `\nRun: ${runUrl}` : ''}`;

  console.log(`Detected branch: ${branchName || '<none>'}`);
  console.log(`Detected state: ${state || '<none>'}`);
  console.log(`Detected issue keys: ${issueKeys.join(', ')}`);

  for (const issueKey of issueKeys) {
    if (state === 'FAIL') {
      await addComment({ baseUrl, email, apiToken, issueKey, comment: `${comment}\nStatus: FAILED` });
      console.log(`Commented failure on issue key: ${issueKey}`);
      continue;
    }

    if (state === 'DONE') {
      await addComment({ baseUrl, email, apiToken, issueKey, comment: `${comment}\nStatus: MERGED -> moving to Done` });
      const target = process.env.JIRA_TRANSITION_DONE || 'DONE';
      const result = await transitionIssue({ baseUrl, email, apiToken, issueKey, transitionName: target });
      console.log(`Transitioned issue key: ${issueKey}`);
      console.log(`Target status: ${target}`);
      console.log(`Transition result: ${JSON.stringify(result)}`);
      continue;
    }

    await addComment({ baseUrl, email, apiToken, issueKey, comment });
  }

  console.log(JSON.stringify({ state, issueKeys }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
