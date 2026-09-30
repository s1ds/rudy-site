import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const output = resolve(root, 'single-file');

let html = await readFile(resolve(dist, 'index.html'), 'utf8');
const cssPath = html.match(/href="\.\/(assets\/[^"]+\.css)"/)?.[1];
const jsPath = html.match(/src="\.\/(assets\/[^"]+\.js)"/)?.[1];

if (!cssPath || !jsPath) throw new Error('Could not find the built CSS and JavaScript files.');

const css = await readFile(resolve(dist, cssPath), 'utf8');
const js = await readFile(resolve(dist, jsPath), 'utf8');
const cssBase64 = Buffer.from(css).toString('base64');
const jsBase64 = Buffer.from(js).toString('base64');
const loader = `
      const decode = (value) => Uint8Array.from(atob(value), character => character.charCodeAt(0));
      const style = document.createElement('style');
      style.textContent = new TextDecoder().decode(decode('${cssBase64}'));
      document.head.appendChild(style);
      const app = new Blob([decode('${jsBase64}')], { type: 'text/javascript' });
      import(URL.createObjectURL(app));
    `;

html = html
  .replace(/\s*<link rel="stylesheet"[^>]+>/, '')
  .replace(/\s*<script type="module"[^>]+><\/script>/, `\n    <script type="module">${loader}</script>`)
  .replace('<link rel="icon" href="./favicon.svg" type="image/svg+xml" />', '');

await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'index.html'), html, 'utf8');
