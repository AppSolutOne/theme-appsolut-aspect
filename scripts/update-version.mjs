/* eslint-disable no-console -- allow logs for information */
import fs from 'node:fs';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Read package.json to get version
const packageJsonPath = path.join(projectRoot, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const version = packageJson.version;

// Read the HBS file with theme version.
const hbsFilePath = path.join(projectRoot, 'partials/theme-head-script.hbs');
let hbsContent = fs.readFileSync(hbsFilePath, 'utf8');

// Simple regex that matches any theme name in the window object.
const regex = /window\.[A-Za-z]+\s*=\s*{\s*version:\s*['"](?:[^'"]+)['"]\s*}/;

// Extract the theme name from the match
const match = hbsContent.match(regex);
if (!match) {
	console.error('Could not find version pattern in theme-head-script.hbs');
	// eslint-disable-next-line no-undef -- process is not defined in ESM
	process.exit(1);
}

// Replace only the version number while preserving the theme name
hbsContent = hbsContent.replace(regex, (fullMatch) =>
	fullMatch.replace(/['"](?:[^'"]+)['"]/, `'${version}'`),
);

// Write the updated content back to the file
fs.writeFileSync(hbsFilePath, hbsContent);

console.log(`Updated version in theme-head-script.hbs to ${version}`);
