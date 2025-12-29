const fs = require('fs');
const packageJson = fs.readFileSync('./package.json', 'utf-8');
console.log('package.json content:', packageJson);