const fs = require('fs');
const assert = require('assert');
const content = fs.readFileSync('src/index.js','utf8');
assert(content.includes('id="layoutTab"'), 'layoutTab missing');
assert(content.includes('id="phaseTab"'), 'phaseTab missing');
console.log('All tests passed');
