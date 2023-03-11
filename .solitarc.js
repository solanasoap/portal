const path = require('path');
const programDir = path.join(__dirname, 'programs/soap-program');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'lib', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
    idlGenerator: 'anchor',
    programName: 'soap_program',
    programId: '4ytc1xagmoutbU1ppmEPMUuFFM7Eso3c2ZRk4nBrkGYq',
    idlDir,
    sdkDir,
    binaryInstallDir,
    programDir,
};