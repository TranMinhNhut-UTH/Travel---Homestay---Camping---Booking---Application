import fs from 'node:fs';
import path from 'node:path';
import { createIssue, buildIssueFields, resolveEpicLinkFieldId } from './jira-client.mjs';

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function parseIssues(inputJson, templatePath) {
  if (inputJson && inputJson.trim()) {
    return JSON.parse(inputJson);
  }

  return readJson(templatePath);
}

function resolveProjectKey(epicKey, projectKey) {
  if (projectKey && projectKey.trim()) {
    return projectKey.trim();
  }

  const prefix = String(epicKey || '').split('-')[0];
  if (!prefix) {
    throw new Error('Cannot derive project key from epic key. Set JIRA_PROJECT_KEY.');
  }

  return prefix;
}

async function main() {
  const baseUrl = process.env.JIRA_BASE_URL;
  const email = process.env.JIRA_EMAIL;
  const apiToken = process.env.JIRA_API_TOKEN;
  const epicKey = process.env.JIRA_EPIC_KEY;
  const projectKey = resolveProjectKey(epicKey, process.env.JIRA_PROJECT_KEY);
  const issueType = process.env.JIRA_ISSUE_TYPE || 'Task';
  const epicLinkFieldId = await resolveEpicLinkFieldId({
    baseUrl,
    email,
    apiToken,
    preferredFieldId: process.env.JIRA_EPIC_LINK_FIELD_ID,
  });
  const labels = (process.env.JIRA_LABELS || 'automation,cicd,github-actions').split(',').map((item) => item.trim()).filter(Boolean);
  const templatePath = process.env.JIRA_TEMPLATE_PATH || path.resolve('.github/jira-templates/default-issues.json');
  const inputJson = process.env.JIRA_ISSUES_JSON || '';

  if (!baseUrl || !email || !apiToken || !epicKey) {
    throw new Error('Missing required env vars: JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_EPIC_KEY');
  }

  const issues = parseIssues(inputJson, templatePath);
  if (!Array.isArray(issues) || issues.length === 0) {
    throw new Error('Issue template is empty. Provide JIRA_ISSUES_JSON or a template file.');
  }

  if (!epicLinkFieldId) {
    console.warn('Warning: Epic Link field could not be resolved automatically. Issues will be created without epic linkage.');
  }

  const created = [];
  for (const item of issues) {
    const summary = item.summary || item.title;
    if (!summary) {
      throw new Error('Every issue item must have a summary or title.');
    }

    const fields = buildIssueFields({
      projectKey,
      summary: item.summary || item.title,
      description: item.description,
      issueType: item.issueType || issueType,
      epicKey,
      epicLinkFieldId,
      labels: [...labels, ...(item.labels || [])],
    });

    const result = await createIssue({ baseUrl, email, apiToken, fields });
    created.push({ key: result.key, summary });
  }

  console.log(JSON.stringify({ epicKey, created }, null, 2));
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
