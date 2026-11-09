import { copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distDirectory = resolve(projectRoot, 'dist');

const indexPath = resolve(projectRoot, 'index.html');
const stylesPath = resolve(projectRoot, 'styles.css');

const indexHtml = await readFile(indexPath, 'utf8');

const sourceScriptPath = 'src="./dist/main.js"';
const deployScriptPath = 'src="./main.js"';

if (!indexHtml.includes(sourceScriptPath)) {
  throw new Error('Could not find the TypeScript entry point in index.html');
}

const deployHtml = indexHtml.replace(sourceScriptPath, deployScriptPath);

await Promise.all([
  writeFile(resolve(distDirectory, 'index.html'), deployHtml),
  copyFile(stylesPath, resolve(distDirectory, 'styles.css')),
]);

console.log('Deployment files prepared successfully.');
