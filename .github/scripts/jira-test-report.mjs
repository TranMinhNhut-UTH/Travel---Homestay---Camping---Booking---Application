import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import {
  addComment,
  buildIssueFields,
  createIssue,
  linkIssues,
  searchIssues,
} from './jira-client.mjs';

const REQUIRED_JIRA_ENV = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN', 'JIRA_PROJECT_KEY'];
const SERVICE_NAMES = [
  'APIGatewayService',
  'CustomerService',
  'DealerManagementService',
  'NotificationService',
  'ReportingService',
  'SalesService',
  'UserService',
  'VehicleService',
];

function env(name, fallback = '') {
  return String(process.env[name] || fallback).trim();
}

function compactLabel(value) {
  return String(value || 'unknown-module')
    .replace(/Service$/i, '')
    .replace(/[^a-zA-Z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase() || 'unknown-module';
}

function addDaysIso(date, days) {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString().slice(0, 10);
}

function readLog(filePath) {
  if (!filePath || !fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf8').trim();
}

function collectLogs() {
  return ['unit-test.log', 'newman.log', 'postman-validation.log', 'dotnet-build.log']
    .map((filePath) => ({ filePath, content: readLog(filePath) }))
    .filter((item) => item.content);
}

function inferModule(logText, outcomes = {}) {
  const explicit = env('TEST_MODULE');
  if (explicit) return explicit;
  const failureText = logText.split(/\r?\n/)
    .filter((line) => /(fail|error|exception|timed out|assert)/i.test(line))
    .join('\n');
  const match = SERVICE_NAMES.find((service) => new RegExp(service, 'i').test(failureText));
  if (match) return match;
  if (outcomes.apiTests === 'failure' || outcomes.services === 'failure') return 'APIGatewayService';
  if (Object.values(outcomes).every((outcome) => outcome !== 'failure')) return 'All Services';
  return 'UnknownService';
}

function inferTestName(logText, outcomes = {}) {
  const explicit = env('TEST_NAME');
  if (explicit) return explicit;
  const dotnetFailure = logText.match(/^\s*Failed\s+([^\r\n[]+)/im);
  if (dotnetFailure) return dotnetFailure[1].trim();
  const newmanFailure = logText.match(/^\s*\d+\.\s+(.+)$/m);
  if (newmanFailure) return newmanFailure[1].trim().slice(0, 120);
  if (outcomes.unitTests === 'failure') return '.NET Unit Tests';
  if (outcomes.apiTests === 'failure') return 'Postman API Integration Tests';
  if (outcomes.build === 'failure') return '.NET Build Verification';
  if (outcomes.postmanValidation === 'failure') return 'Postman Collection Validation';
  if (outcomes.services === 'failure') return 'Service Startup Verification';
  return 'CI Test Suite';
}

function priorityForModule(moduleName) {
  return /(api\s*gateway|auth|sales|user|dealer)/i.test(moduleName) ? 'High' : 'Medium';
}

function briefError(logs) {
  const combined = logs.map(({ filePath, content }) => `--- ${filePath} ---\n${content}`).join('\n');
  const errorLines = combined.split(/\r?\n/).filter((line) => /(fail|error|exception|timed out|assert)/i.test(line));
  const selected = (errorLines.length ? errorLines : combined.split(/\r?\n/).slice(-30)).slice(0, 30).join('\n');
  return selected.slice(0, 3500) || 'No detailed error log was produced. Review the GitHub Actions run.';
}

function failureOutcomeSummary(outcomes) {
  const failed = Object.entries(outcomes)
    .filter(([, outcome]) => outcome === 'failure')
    .map(([name]) => name);
  return failed.length ? failed.join(', ') : 'Failure occurred before a tracked CI step completed';
}

export function buildProfessionalDescription(context) {
  const reporter = context.reporterAccountId
    ? `Jira accountId ${context.reporterAccountId}`
    : `${context.actor || 'Unknown'} (issue created by the Jira account associated with the API token)`;
  return [
    'h2. Automated Test Failure',
    `*1. Module/Service:* ${context.module}`,
    `*2. Branch:* ${context.branch}`,
    `*3. Commit SHA:* ${context.sha}`,
    `*4. CI actor / Reporter:* ${context.actor || 'Unknown'} / ${reporter}`,
    `*5. Failed test suite/case:* ${context.testName}`,
    `*6. Expected result:* ${context.expectedResult}`,
    `*7. Actual result:* ${context.actualResult}`,
    `*8. Short error log:*\n{code}\n${context.errorLog}\n{code}`,
    `*9. GitHub Actions run:* ${context.runUrl || 'Not available'}`,
    '*10. Test Status:* FAIL',
    `*11. Suggested action:* ${context.suggestedAction}`,
    `*12. GitHub job:* ${context.job}`,
    `*13. Failed job/step summary:* ${context.failedStepSummary}`,
    `*14. Failure recorded at:* ${context.recordedAt}`,
    '*15. Software Verification workflow:*',
    '{code}feature branch -> CI fail -> Jira Bug TODO -> assign fixer -> bugfix branch -> PR -> CI pass -> merge main -> Jira DONE{code}',
  ].join('\n\n');
}

export function buildJiraIssuePayload(context) {
  const fields = buildIssueFields({
    projectKey: context.projectKey,
    summary: `[CI FAIL] ${context.branch} failed GitHub Actions`.slice(0, 255),
    description: buildProfessionalDescription(context),
    issueType: 'Bug',
    labels: [...new Set([
      'auto-test',
      'github-actions',
      'ci-fail',
      'software-verification',
      compactLabel(context.module),
    ])],
    priority: priorityForModule(context.module),
    dueDate: context.dueDate,
    reporterAccountId: context.reporterAccountId,
    assigneeAccountId: context.assigneeAccountId,
    componentName: context.componentName,
  });
  return { fields };
}

export async function addJiraComment(client, issueKey, context) {
  const reporter = context.reporterAccountId || `${context.actor} / Jira API token account`;
  const comment = [
    `Repo: ${context.repository}`,
    `Branch: ${context.branch}`,
    `Commit: ${context.sha}`,
    `CI Run: ${context.runUrl || 'Not available'}`,
    'Test Status: FAIL',
    `Failed job/step: ${context.failedStepSummary}`,
    `Error summary: ${context.errorLog}`,
    `Time: ${context.recordedAt}`,
    `Reporter: ${reporter}`,
    'Created by automation for Software Verification workflow.',
    'Fixer must create bugfix branch and reference Jira ID in commit message.',
  ].join('\n');
  return addComment({ ...client, issueKey, comment });
}

function normalizeComparable(value) {
  return String(value || '').trim().toLowerCase();
}

export async function findExistingCiFailureIssue(client, context) {
  const projectKey = context.projectKey.replace(/[^A-Z0-9_-]/gi, '');
  const jql = `project = "${projectKey}" AND statusCategory != Done AND labels = "ci-fail" ORDER BY created DESC`;
  console.log(`[Jira Dedup] Searching open CI failure issues for project ${projectKey}.`);
  const issues = await searchIssues({
    ...client,
    jql,
    maxResults: 100,
    fields: ['summary', 'description', 'status'],
  });
  const branch = normalizeComparable(context.branch);
  const runUrl = normalizeComparable(context.runUrl);
  const match = issues.find((issue) => {
    const summary = normalizeComparable(issue.fields?.summary);
    const description = normalizeComparable(issue.fields?.description);
    return (branch && (summary.includes(branch) || description.includes(branch)))
      || (runUrl && description.includes(runUrl));
  });
  console.log(`[Jira Dedup] Candidate count=${issues.length}; match=${match?.key || 'none'}.`);
  return match || null;
}

export async function createJiraBugFromTestFailure(client, context) {
  const existing = await findExistingCiFailureIssue(client, context);
  if (existing) {
    await addJiraComment(client, existing.key, context);
    console.log(`Updated existing Jira CI failure issue: ${existing.key}`);
    return { key: existing.key, created: false };
  }

  let payload = buildJiraIssuePayload(context);
  let result;
  try {
    result = await createIssue({ ...client, fields: payload.fields });
  } catch (error) {
    const hasOptionalIdentity = payload.fields.reporter || payload.fields.assignee;
    if (!hasOptionalIdentity || error.status !== 400) throw error;
    console.warn('Jira rejected reporter/assignee. Retrying once without both optional identity fields.');
    const { reporter: _reporter, assignee: _assignee, ...retryFields } = payload.fields;
    payload = { fields: retryFields };
    result = await createIssue({ ...client, fields: retryFields });
  }

  try {
    await addJiraComment(client, result.key, context);
  } catch (error) {
    console.error(`[Jira CI Report] Bug ${result.key} was created, but its follow-up comment failed: ${error.message}`);
  }
  if (context.linkIssueKey) {
    try {
      await linkIssues({
        ...client,
        outwardIssueKey: result.key,
        inwardIssueKey: context.linkIssueKey,
        linkType: 'Relates',
      });
    } catch (error) {
      console.error(`[Jira CI Report] Bug ${result.key} was created, but linking it to ${context.linkIssueKey} failed: ${error.message}`);
    }
  }
  return { ...result, created: true };
}

function buildContext() {
  const logs = collectLogs();
  const logText = logs.map((item) => item.content).join('\n');
  const outcomes = {
    branchValidation: env('BRANCH_VALIDATION_OUTCOME'),
    postmanValidation: env('POSTMAN_VALIDATION_OUTCOME'),
    restore: env('RESTORE_OUTCOME'),
    build: env('BUILD_OUTCOME'),
    unitTests: env('UNIT_TEST_OUTCOME'),
    services: env('SERVICES_OUTCOME'),
    apiTests: env('API_TESTS_OUTCOME'),
  };
  const moduleName = inferModule(logText, outcomes);
  const testName = inferTestName(logText, outcomes);
  return {
    projectKey: env('JIRA_PROJECT_KEY'),
    reporterAccountId: env('JIRA_REPORTER_ACCOUNT_ID'),
    assigneeAccountId: env('JIRA_DEFAULT_ASSIGNEE_ACCOUNT_ID'),
    // Only set JIRA_COMPONENT_NAME after confirming the component exists in Jira.
    componentName: env('JIRA_COMPONENT_NAME'),
    linkIssueKey: env('JIRA_LINK_ISSUE_KEY'),
    repository: env('GITHUB_REPOSITORY', 'unknown-repository'),
    branch: env('GITHUB_REF_NAME', 'unknown-branch'),
    sha: env('GITHUB_SHA', 'unknown-commit'),
    actor: env('GITHUB_ACTOR', 'unknown-actor'),
    runUrl: env('GITHUB_RUN_URL'),
    job: env('GITHUB_JOB', 'unknown-job'),
    module: moduleName,
    testName,
    expectedResult: env('TEST_EXPECTED_RESULT', 'All automated checks pass without errors.'),
    actualResult: env('TEST_ACTUAL_RESULT', `${testName} failed during CI execution.`),
    errorLog: briefError(logs),
    failedStepSummary: failureOutcomeSummary(outcomes),
    recordedAt: new Date().toISOString(),
    suggestedAction: env(
      'TEST_SUGGESTED_ACTION',
      `Create a bugfix branch referencing the Jira ID, reproduce ${testName}, fix the root cause, and add or update regression tests.`,
    ),
    dueDate: addDaysIso(new Date(), 7),
    outcomes,
  };
}

function appendStepSummary(status, context) {
  const summaryPath = env('GITHUB_STEP_SUMMARY');
  const testSummary = Object.entries(context.outcomes)
    .map(([name, value]) => `${name}=${value || 'not-run'}`)
    .join(', ');
  const report = [
    '## Software Verification Test Report',
    '',
    `- Test Status: ${status}`,
    `- Branch: ${context.branch}`,
    `- Commit: ${context.sha}`,
    `- Service: ${context.module}`,
    `- Test summary: ${testSummary}`,
    `- Date/time: ${new Date().toISOString()}`,
    '',
  ].join('\n');

  console.log(report);
  if (summaryPath) fs.appendFileSync(summaryPath, report);
}

async function main() {
  const status = env('TEST_STATUS', process.argv[2] || 'FAIL').toUpperCase();
  if (!['PASS', 'FAIL'].includes(status)) {
    throw new Error(`Invalid TEST_STATUS "${status}". Expected PASS or FAIL.`);
  }

  const context = buildContext();
  appendStepSummary(status, context);
  if (status === 'PASS') return;

  const missing = REQUIRED_JIRA_ENV.filter((name) => !env(name));
  if (missing.length) {
    throw new Error(`[Jira Configuration] Cannot create Jira Bug. Missing required environment variables: ${missing.join(', ')}`);
  }
  if (context.projectKey.toUpperCase() !== 'ED') {
    throw new Error(`[Jira Configuration] JIRA_PROJECT_KEY must be ED for CI failure issues; received "${context.projectKey}".`);
  }

  const result = await createJiraBugFromTestFailure({
    baseUrl: env('JIRA_BASE_URL'),
    email: env('JIRA_EMAIL'),
    apiToken: env('JIRA_API_TOKEN'),
  }, context);
  const action = result.created ? 'Created' : 'Updated existing';
  console.log(`${action} Jira CI failure issue: ${result.key}`);

  const automationIssueKey = env('JIRA_AUTOMATION_ISSUE_KEY', 'ED-33');
  const automationMessage = result.created
    ? `CI failed. Created linked bug: ${result.key}`
    : `CI failed. Updated existing linked bug: ${result.key}`;
  await addComment({
    baseUrl: env('JIRA_BASE_URL'),
    email: env('JIRA_EMAIL'),
    apiToken: env('JIRA_API_TOKEN'),
    issueKey: automationIssueKey,
    comment: `${automationMessage}\nBranch: ${context.branch}\nCommit: ${context.sha}\nRun: ${context.runUrl || 'Not available'}\nTime: ${context.recordedAt}`,
  });
  console.log(`Automation tracking comment added to ${automationIssueKey}.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(`[Jira CI Report] ERROR: ${error.stack || error.message}`);
    process.exit(1);
  });
}
