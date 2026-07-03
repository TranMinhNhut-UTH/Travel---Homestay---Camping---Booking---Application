/**
 * count-postman-tests.js
 * Đếm tổng requests và pm.test assertions trong Postman collection.
 * Xử lý UTF-8 BOM.
 * Usage: node scripts/count-postman-tests.js [path-to-collection.json]
 */
const fs = require('fs');
const path = require('path');

const filePath = process.argv[2] || path.join(__dirname, '..', 'EV Dealer Management API.postman_collection.json');

let raw = fs.readFileSync(filePath, 'utf8');
// Strip BOM
if (raw.charCodeAt(0) === 0xFEFF) {
  raw = raw.slice(1);
}

const collection = JSON.parse(raw);

function countItems(items, parentPath) {
  const result = { requests: 0, tests: 0, folders: [] };
  if (!items) return result;

  for (const item of items) {
    if (item.item) {
      // Folder
      const folderPath = parentPath + '/' + item.name;
      const sub = countItems(item.item, folderPath);
      result.requests += sub.requests;
      result.tests += sub.tests;
      result.folders.push({
        name: item.name,
        path: folderPath,
        requests: sub.requests,
        tests: sub.tests,
        subfolders: sub.folders
      });
    } else if (item.request) {
      // Request
      result.requests++;
      const events = item.event || [];
      for (const evt of events) {
        if (evt.listen === 'test' && evt.script && evt.script.exec) {
          const src = evt.script.exec.join('\n');
          const matches = src.match(/pm\.test\s*\(/g);
          if (matches) result.tests += matches.length;
        }
      }
    }
  }
  return result;
}

const totals = countItems(collection.item, '');

// Print summary
console.log('=== POSTMAN COLLECTION ANALYSIS ===');
console.log(`Collection: ${collection.info.name}`);
console.log(`Total Requests: ${totals.requests}`);
console.log(`Total pm.test Assertions: ${totals.tests}`);
console.log('');

// Print top-level folders
console.log('=== TOP-LEVEL FOLDERS ===');
for (const f of totals.folders) {
  console.log(`\n[${f.name}] — Requests: ${f.requests}, Tests: ${f.tests}`);
  for (const sf of f.subfolders) {
    console.log(`  ├── ${sf.name} — Requests: ${sf.requests}, Tests: ${sf.tests}`);
    for (const ssf of sf.subfolders || []) {
      console.log(`  │   ├── ${ssf.name} — Requests: ${ssf.requests}, Tests: ${ssf.tests}`);
    }
  }
}

// Output JSON for programmatic use
const jsonOutput = {
  collectionName: collection.info.name,
  totalRequests: totals.requests,
  totalTests: totals.tests,
  topFolders: totals.folders.map(f => ({
    name: f.name,
    requests: f.requests,
    tests: f.tests,
    subfolders: f.subfolders.map(sf => ({
      name: sf.name,
      requests: sf.requests,
      tests: sf.tests,
      subfolders: (sf.subfolders || []).map(ssf => ({
        name: ssf.name,
        requests: ssf.requests,
        tests: ssf.tests
      }))
    }))
  }))
};

console.log('\n=== JSON OUTPUT ===');
console.log(JSON.stringify(jsonOutput, null, 2));
