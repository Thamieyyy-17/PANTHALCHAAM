import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const strings = fs.readFileSync('android/app/src/main/res/values/strings.xml', 'utf8');
assert.ok(strings.includes('<string name="app_name">PANTHALCHAAM</string>'), 'Android label mismatch');
const manifestPath = 'android/app/src/main/AndroidManifest.xml';
assert.ok(fs.existsSync(manifestPath), 'Android manifest is missing');
const manifest = fs.readFileSync(manifestPath, 'utf8');
assert.ok(manifest.includes('@mipmap/ic_launcher'), 'Android manifest does not reference the generated launcher icon');

const res = 'android/app/src/main/res';
const pngs = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/^ic_launcher(?:_round|_foreground)?\.png$/i.test(entry.name) && full.includes(`${path.sep}mipmap-`)) pngs.push(full);
  }
}
walk(res);
assert.ok(pngs.length >= 5, `Expected generated launcher icon sizes; found ${pngs.length}`);
for (const file of pngs) assert.ok(fs.statSync(file).size > 1000, `Generated icon is unexpectedly small: ${file}`);
console.log(`Verified PANTHALCHAAM Android label and ${pngs.length} generated launcher image files.`);
