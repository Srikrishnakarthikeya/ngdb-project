import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const backendRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const dataDirectory = path.join(backendRoot, 'data');
const fileFor = (collection) => path.join(dataDirectory, `${collection}.json`);

export async function ensureCollection(collection, initialValue = []) {
  await fs.mkdir(dataDirectory, { recursive: true });
  const file = fileFor(collection);
  try { await fs.access(file); } catch { await fs.writeFile(file, JSON.stringify(initialValue, null, 2), 'utf8'); }
}

export async function readCollection(collection) {
  await ensureCollection(collection);
  try {
    const value = JSON.parse(await fs.readFile(fileFor(collection), 'utf8'));
    return Array.isArray(value) ? value : [];
  } catch (error) {
    if (error instanceof SyntaxError) throw new Error(`Invalid JSON in ${collection}.json`);
    throw error;
  }
}

export async function writeCollection(collection, records) {
  await ensureCollection(collection);
  const file = fileFor(collection);
  const temporary = `${file}.${randomUUID()}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(records, null, 2), 'utf8');
  await fs.rename(temporary, file);
}

export async function find(collection, filter = {}) {
  const records = await readCollection(collection);
  return records.filter((record) => Object.entries(filter).every(([key, value]) => String(record[key] ?? '') === String(value)));
}

export async function findOne(collection, filter) {
  const records = await find(collection, filter);
  return records[0] || null;
}

export async function create(collection, record) {
  const records = await readCollection(collection);
  const saved = { ...record, _id: record._id || randomUUID(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  records.push(saved);
  await writeCollection(collection, records);
  return saved;
}

export async function update(collection, idField, value, changes) {
  const records = await readCollection(collection);
  const index = records.findIndex((record) => (idField ? String(record[idField]) === String(value) : String(record._id) === String(value)));
  if (index < 0) return null;
  const updated = { ...records[index], ...changes, updatedAt: new Date().toISOString() };
  if (idField) updated[idField] = records[index][idField];
  records[index] = updated;
  await writeCollection(collection, records);
  return updated;
}

export async function remove(collection, idField, value) {
  const records = await readCollection(collection);
  const filtered = records.filter((record) => (idField ? String(record[idField]) !== String(value) : String(record._id) !== String(value)));
  if (filtered.length === records.length) return false;
  await writeCollection(collection, filtered);
  return true;
}
