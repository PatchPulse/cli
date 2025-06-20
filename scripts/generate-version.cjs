const fs = require('fs');
const path = require('path');

// Read package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Create the version file content
const versionContent = `// Auto-generated file - do not edit manually
export const VERSION = '${packageJson.version}';
`;

// Ensure the gen directory exists
const genDir = path.join(process.cwd(), 'src', 'gen');
if (!fs.existsSync(genDir)) {
  fs.mkdirSync(genDir, { recursive: true });
}

// Write the version file
const versionFilePath = path.join(genDir, 'version.gen.ts');
fs.writeFileSync(versionFilePath, versionContent);

console.log(
  `Generated version file: ${versionFilePath} with version ${packageJson.version}`
);
