import fs from 'node:fs';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const capacitor = readJson('capacitor.config.json');
const google = readJson('google-services.json');
const pkg = readJson('package.json');
const iconPaths = ['icon.png', 'public/icon.png', 'assets/icon.png', 'resources/icon.png'];
const expectedName = 'PANTHALCHAAM';

assert.equal(capacitor.appName, expectedName, 'Capacitor appName must be PANTHALCHAAM');
assert.equal(pkg.name, 'panthalchaam', 'npm project name must be panthalchaam');
assert.equal(capacitor.appId, 'com.turfbook.app', 'Keep the registered Firebase Android package ID unchanged');
assert.ok(google.client?.some(client => client.client_info?.android_client_info?.package_name === capacitor.appId), 'google-services.json must match the Capacitor appId');
assert.equal(google.project_info?.project_id, 'turfbook-966bc', 'Unexpected Firebase project ID');

const iconHashes = iconPaths.map(file => {
  assert.ok(fs.existsSync(file), `Missing icon file: ${file}`);
  const bytes = fs.readFileSync(file);
  assert.ok(bytes.length > 1000, `Icon file is unexpectedly small: ${file}`);
  return crypto.createHash('sha256').update(bytes).digest('hex');
});
assert.ok(iconHashes.every(hash => hash === iconHashes[0]), 'All shipped icon source files must be byte-identical');

const index = fs.readFileSync('index.html', 'utf8');
assert.ok(index.includes('<title>PANTHALCHAAM</title>'), 'index.html title must be PANTHALCHAAM');
assert.ok(index.includes('src="/src/main.jsx"'), 'index.html entry point must match src/main.jsx');

const main = fs.readFileSync('src/main.jsx', 'utf8');
const app = fs.readFileSync('src/App.jsx', 'utf8');
const functions = fs.readFileSync('functions/index.js', 'utf8');
const source = [main, app, functions].join('\n');
assert.ok(!/bootstrapAdmin|TURFBOOK_BOOTSTRAP_SECRET/.test(source), 'Legacy bootstrap admin secret flow must not exist');
assert.ok(!/localStorage|sessionStorage/.test(source), 'Business data must not be stored in browser/device storage');
assert.ok(app.includes('PANTHALCHAAM'), 'App source must include PANTHALCHAAM branding');
assert.ok(functions.includes("channelId: 'panthalchaam_alerts'"), 'Cloud notifications must target the PANTHALCHAAM channel');
assert.ok(fs.existsSync('resources/android/raw/panthalchaam_alert.wav'), 'Android custom notification sound is missing');
const env = fs.readFileSync('.env.production', 'utf8');
for (const key of ['VITE_FIREBASE_API_KEY=', 'VITE_FIREBASE_AUTH_DOMAIN=', 'VITE_FIREBASE_PROJECT_ID=', 'VITE_FIREBASE_APP_ID=']) {
  assert.ok(env.includes(key), `Missing Firebase build config: ${key}`);
}

console.log('Project consistency checks passed.');
console.log(`Icon SHA-256: ${iconHashes[0]}`);
console.log(`Firebase project: ${google.project_info.project_id}`);
console.log(`Android application ID: ${capacitor.appId}`);
