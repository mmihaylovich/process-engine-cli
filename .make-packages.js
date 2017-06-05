var pkg = require('./package.json');
var fs = require('fs');
var path = require('path');
delete pkg.scripts;

var cjsPkg = Object.assign({}, pkg, {
  name: 'process-engine-cli',
  main: 'crz.js',
  types: 'crz.d.ts'
});

fs.writeFileSync('built/package.json', JSON.stringify(cjsPkg, null, 2));
fs.writeFileSync('built/LICENSE.txt', fs.readFileSync('./LICENSE.txt').toString());
fs.writeFileSync('built/README.md', fs.readFileSync('./README.md').toString());