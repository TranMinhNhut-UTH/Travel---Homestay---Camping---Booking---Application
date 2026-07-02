const apiVersion = '2';

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || '').replace(/\/$/, '');
}

function buildAuthHeader(email, apiToken) {
  const token = Buffer.from(`${email}:${apiToken}`).toString('base64');
  return `Basic ${token}`;
}

export function extractIssueKeys(text) {
  const matches = String(text || '').match(/\b[A-Z][A-Z0-9]+-\d+\b/g) || [];
  return [...new Set(matches)];
}

async function jiraRequest(baseUrl, email, apiToken, path, options = {}) {
  const url = `${normalizeBaseUrl(baseUrl)}/rest/api/${apiVersion}${path}`;
  const response = await fetch(url, {
    method: options.method || 'GET',
    headers: {
      Authorization: buildAuthHeader(email, apiToken),
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const responseBody = typeof payload === 'string' ? payload : JSON.stringify(payload);
    const message = typeof payload === 'string'
      ? payload
      : [
        ...(payload?.errorMessages || []),
        ...Object.entries(payload?.errors || {}).map(([field, value]) => `${field}: ${value}`),
        payload?.message,
      ].filter(Boolean).join('; ') || response.statusText;
    const error = new Error(`Jira request failed (${response.status}): ${message}\nResponse body: ${responseBody || '<empty>'}`);
    error.status = response.status;
    error.responseBody = payload;
    throw error;
  }

  return payload;
}

export async function createIssue({ baseUrl, email, apiToken, fields }) {
  return jiraRequest(baseUrl, email, apiToken, '/issue', {
    method: 'POST',
    body: { fields },
  });
}

export async function linkIssues({ baseUrl, email, apiToken, outwardIssueKey, inwardIssueKey, linkType = 'Relates' }) {
  if (!outwardIssueKey || !inwardIssueKey || outwardIssueKey === inwardIssueKey) {
    return { skipped: true };
  }

  await jiraRequest(baseUrl, email, apiToken, '/issueLink', {
    method: 'POST',
    body: {
      type: { name: linkType },
      outwardIssue: { key: outwardIssueKey },
      inwardIssue: { key: inwardIssueKey },
    },
  });

  return { skipped: false };
}

export async function getTransitions({ baseUrl, email, apiToken, issueKey }) {
  const data = await jiraRequest(baseUrl, email, apiToken, `/issue/${encodeURIComponent(issueKey)}/transitions`);
  return data.transitions || [];
}

export async function transitionIssue({ baseUrl, email, apiToken, issueKey, transitionName }) {
  const transitions = await getTransitions({ baseUrl, email, apiToken, issueKey });
  const transition = transitions.find((item) => item.name.toLowerCase() === transitionName.toLowerCase())
    || transitions.find((item) => item.name.toLowerCase().includes(transitionName.toLowerCase()));

  if (!transition) {
    return { skipped: true, reason: `Transition not found: ${transitionName}` };
  }

  await jiraRequest(baseUrl, email, apiToken, `/issue/${encodeURIComponent(issueKey)}/transitions`, {
    method: 'POST',
    body: { transition: { id: transition.id } },
  });

  return { skipped: false, transition: transition.name };
}

export async function addComment({ baseUrl, email, apiToken, issueKey, comment }) {
  return jiraRequest(baseUrl, email, apiToken, `/issue/${encodeURIComponent(issueKey)}/comment`, {
    method: 'POST',
    body: { body: String(comment) },
  });
}

export async function getFields({ baseUrl, email, apiToken }) {
  return jiraRequest(baseUrl, email, apiToken, '/field');
}

export async function resolveEpicLinkFieldId({ baseUrl, email, apiToken, preferredFieldId }) {
  if (preferredFieldId && String(preferredFieldId).trim()) {
    return String(preferredFieldId).trim();
  }

  const fields = await getFields({ baseUrl, email, apiToken });
  const epicLinkField = fields.find((field) => String(field.name || '').toLowerCase() === 'epic link');

  if (epicLinkField?.id) {
    return epicLinkField.id;
  }

  return null;
}

export function buildIssueFields({
  projectKey,
  summary,
  description,
  issueType,
  epicKey,
  epicLinkFieldId,
  labels = [],
  priority,
  dueDate,
  reporterAccountId,
  assigneeAccountId,
  componentName,
}) {
  const fields = {
    project: { key: projectKey },
    summary,
    issuetype: { name: issueType || 'Task' },
  };

  if (description) {
    fields.description = description;
  }

  if (labels.length > 0) {
    fields.labels = labels;
  }

  if (priority) {
    fields.priority = { name: priority };
  }

  if (dueDate) {
    fields.duedate = dueDate;
  }

  if (reporterAccountId) {
    fields.reporter = { accountId: reporterAccountId };
  }

  if (assigneeAccountId) {
    fields.assignee = { accountId: assigneeAccountId };
  }

  // Components are opt-in because Jira rejects names that do not exist in the project.
  if (componentName) {
    fields.components = [{ name: componentName }];
  }

  if (epicKey && epicLinkFieldId) {
    fields[epicLinkFieldId] = epicKey;
  }

  return fields;
}
