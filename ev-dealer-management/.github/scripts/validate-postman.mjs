import fs from 'node:fs';

const filePath = process.argv[2];

if (!filePath) {
  console.error('Usage: node validate-postman.mjs <collection.json>');
  process.exit(1);
}

const raw = fs.readFileSync(filePath, 'utf8');
const collection = JSON.parse(raw);

if (!collection.info?.name || !Array.isArray(collection.item) || collection.item.length === 0) {
  throw new Error('Invalid Postman collection structure');
}

console.log(`Postman collection OK: ${collection.info.name}`);
