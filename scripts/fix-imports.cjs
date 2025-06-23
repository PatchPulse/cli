#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix relative imports to include .js extension
  content = content.replace(
    /from ['"](\.\/[^'"]*?)['"]/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js')) {
        // Check if this is a directory import
        const dirPath = path.join(path.dirname(filePath), importPath);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
          return `from '${importPath}/index.js'`;
        }
        return `from '${importPath}.js'`;
      }
      return match;
    }
  );

  // Fix relative imports with ../
  content = content.replace(
    /from ['"](\.\.\/[^'"]*?)['"]/g,
    (match, importPath) => {
      if (!importPath.endsWith('.js')) {
        // Check if this is a directory import
        const dirPath = path.join(path.dirname(filePath), importPath);
        if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
          return `from '${importPath}/index.js'`;
        }
        return `from '${importPath}.js'`;
      }
      return match;
    }
  );

  fs.writeFileSync(filePath, content);
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.js')) {
      fixImportsInFile(filePath);
    }
  }
}

// Process the lib directory
const libDir = path.join(__dirname, '..', 'lib');
if (fs.existsSync(libDir)) {
  processDirectory(libDir);
  console.log('✅ Fixed import extensions in compiled files');
} else {
  console.log('❌ lib directory not found');
}
