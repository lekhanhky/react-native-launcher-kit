const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('Building react-native-launcher-kit for distribution...');

// Clean and create dist
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Build type definitions
console.log('Running bob build...');
execSync('npx bob build', { cwd: rootDir, stdio: 'inherit' });

// Copy lib/typescript
const libTsSrc = path.join(rootDir, 'lib', 'typescript');
const libTsDest = path.join(distDir, 'lib', 'typescript');
fs.mkdirSync(path.dirname(libTsDest), { recursive: true });
if (fs.existsSync(libTsSrc)) {
  fs.cpSync(libTsSrc, libTsDest, {
    recursive: true,
    filter: (src) => !src.includes('__tests__'),
  });
}

// Copy android files
const androidDest = path.join(distDir, 'android');
fs.mkdirSync(androidDest, { recursive: true });
fs.copyFileSync(
  path.join(rootDir, 'android', 'build.gradle'),
  path.join(androidDest, 'build.gradle')
);
fs.copyFileSync(
  path.join(rootDir, 'android', 'gradle.properties'),
  path.join(androidDest, 'gradle.properties')
);
fs.cpSync(
  path.join(rootDir, 'android', 'src'),
  path.join(androidDest, 'src'),
  { recursive: true }
);

// Copy src
const srcDest = path.join(distDir, 'src');
fs.cpSync(path.join(rootDir, 'src'), srcDest, {
  recursive: true,
  filter: (src) => !src.includes('__tests__'),
});

// Copy package files
fs.copyFileSync(path.join(rootDir, 'package.json'), path.join(distDir, 'package.json'));
fs.copyFileSync(path.join(rootDir, 'README.md'), path.join(distDir, 'README.md'));
fs.copyFileSync(path.join(rootDir, 'LICENSE'), path.join(distDir, 'LICENSE'));

console.log('\nDone! dist/ is ready.');
