import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const rules = [];
for (const line of fs.readFileSync(path.join(root, '_headers'), 'utf8').split(/\r?\n/)) {
  if (line.startsWith('/')) rules.push({ route: line, headers: [] });
  else if (line.trim()) rules.at(-1).headers.push(line.trim());
}
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain' };

const github = process.env.STATIC_HOST === 'github';
// Local-only test helper for both supported static hosting targets.
http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://127.0.0.1').pathname;
  let file = path.resolve(root, `.${pathname}`);
  if (file !== root && !file.startsWith(root + path.sep)) {
    response.writeHead(403).end('Access denied'); return;
  }
  if (pathname === '/') file = path.join(root, 'index.html');
  if (!github && !fs.existsSync(file) && fs.existsSync(`${file}.html`)) file += '.html';
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
    file = path.join(root, github ? '404.html' : 'index.html');
    if (github) response.statusCode = 404;
  }
  for (const rule of (github ? [] : rules).filter((item) => item.route === pathname ||
    (item.route.endsWith('*') && pathname.startsWith(item.route.slice(0, -1))))) {
    for (const header of rule.headers) {
      if (header.startsWith('! ')) response.removeHeader(header.slice(2));
      else {
        const delimiter = header.indexOf(':');
        response.setHeader(header.slice(0, delimiter), header.slice(delimiter + 1).trim());
      }
    }
  }
  response.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
  fs.createReadStream(file).pipe(response);
}).listen(4173, '127.0.0.1', () => console.log('Static test preview listening on 127.0.0.1:4173'));
