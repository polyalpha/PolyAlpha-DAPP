const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

var files = fs.readdirSync(__dirname + '/contracts/');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

var sourceFiles = {};

for (var i=0;i<files.length;i++) {
    if (!files[i].startsWith('.')) {
        const contractPath = path.resolve(__dirname, 'contracts', files[i]);
        var fileContent = fs.readFileSync(contractPath, 'utf8');
        sourceFiles[files[i]] = fileContent;
    }
}

var result = solc.compile({language: "Solidity", sources: sourceFiles}, 1);
console.log(result);
var output = result.contracts;

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.split(':')[1] + '.json'),
        output[contract]
    );
}

