import fs from 'node:fs';
import path from 'node:path';

const forbidden = /(?:-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|sb_secret_[A-Za-z0-9_-]{20,}|gh[pousr]_[A-Za-z0-9]{30,})/;
let count = 0;
function inspect(directory) {
  for (const file of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, file.name);
    if (/^\.env|^\.pgdata$|^\.vercel$|^storage$/.test(file.name)) throw new Error('Private file/directory detected in static output.');
    if (file.isDirectory()) inspect(full);
    else {
      count++;
      if (/\.(js|html|css|json|txt|xml)$/.test(file.name) && forbidden.test(fs.readFileSync(full, 'utf8'))) {
        throw new Error('Possible credential pattern detected in static output.');
      }
    }
  }
}
inspect('dist');
for (const name of ['index.html', 'app-ads.txt', '_headers', '_redirects']) {
  if (!fs.existsSync(path.join('dist', name))) throw new Error(`Missing output: ${name}`);
}
console.log(`Static output checked: ${count} files; no matched private-file or credential patterns.`);
