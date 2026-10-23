import fs from 'node:fs';

// Keep GitHub-specific domain/404 files in source, but not in the Pages upload.
for (const name of ['CNAME', '404.html']) {
  fs.rmSync(`dist/${name}`);
}
console.log('Cloudflare upload prepared; existing domain/DNS configuration is unchanged.');
