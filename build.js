const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- [T Lab AI] Building Frontend Bundle ---');
const frontendDir = path.join(__dirname, 'frontend');

execSync('npm install', { cwd: frontendDir, stdio: 'inherit' });
execSync('npm run build', { cwd: frontendDir, stdio: 'inherit' });

const srcDist = path.join(frontendDir, 'dist');
const dstDist = path.join(__dirname, 'dist');

if (fs.existsSync(srcDist)) {
  fs.cpSync(srcDist, dstDist, { recursive: true, force: true });
  console.log('--- [T Lab AI] Artifacts synced to root /dist and frontend/dist ---');
}
