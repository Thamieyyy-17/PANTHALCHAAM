import fs from 'node:fs';
import path from 'node:path';

const appName = 'PANTHALCHAAM';
const stringsPath = path.join('android', 'app', 'src', 'main', 'res', 'values', 'strings.xml');
if (!fs.existsSync(stringsPath)) throw new Error(`Android strings file not found: ${stringsPath}`);
let xml = fs.readFileSync(stringsPath, 'utf8');
for (const key of ['app_name', 'title_activity_main']) {
  const tag = new RegExp(`<string\\s+name=["']${key}["'][^>]*>[\\s\\S]*?<\\/string>`, 'm');
  const replacement = `<string name="${key}">${appName}</string>`;
  if (tag.test(xml)) xml = xml.replace(tag, replacement);
  else xml = xml.replace('</resources>', `    ${replacement}\n</resources>`);
}
fs.writeFileSync(stringsPath, xml);
const verified = fs.readFileSync(stringsPath, 'utf8');
if (!verified.includes('<string name="app_name">PANTHALCHAAM</string>')) throw new Error('Android launcher label verification failed.');
console.log('Android launcher label verified: PANTHALCHAAM');
