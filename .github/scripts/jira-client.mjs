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
    const message = typeof payload === 'string'
      ? payload
      : payload?.errorMessages?.join('; ') || payload?.message || response.statusText;
    throw new Error(`Jira request failed (${response.status}): ${message}`);
  }

  return payload;
}

export async function createIssue({ baseUrl, email, apiToken, fields }) {
  return jiraRequest(baseUrl, email, apiToken, '/issue', {
    method: 'POST',
    body: { fields },
  });
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

export function buildIssueFields({ projectKey, summary, description, issueType, epicKey, epicLinkFieldId, labels = [] }) {
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

  if (epicKey && epicLinkFieldId) {
    fields[epicLinkFieldId] = epicKey;
  }

  return fields;
}
