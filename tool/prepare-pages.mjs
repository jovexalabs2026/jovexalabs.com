import fs from 'node:fs';

// Keep GitHub-specific domain/404 files in source, but not in the Pages upload.
for (const name of ['CNAME', '404.html']) {
  fs.rmSync(`dist/${name}`);
}
if (fs.existsSync('dist/_redirects')) {
  throw new Error('Review redirect rules before upload: catch-all rewrites override JavaScript assets on Pages.');
}
console.log('Cloudflare upload prepared; existing domain/DNS configuration is unchanged.');
