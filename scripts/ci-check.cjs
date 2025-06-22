#!/usr/bin/env node

const { execSync } = require('child_process');

function runCommand(command, description) {
  console.log(`🔍 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`❌ ${description} failed!`);
    process.exit(1);
  }
}

console.log('🔍 Running local CI checks...\n');

runCommand('npm ci', 'Installing dependencies');
runCommand('npm run typecheck', 'Type checking');
runCommand('npm run lint', 'Linting');
runCommand('npm run format:check', 'Checking formatting');
runCommand('npm run test:coverage', 'Running tests with coverage');
runCommand('npm run build', 'Building');

console.log('\n✅ All checks passed!');
