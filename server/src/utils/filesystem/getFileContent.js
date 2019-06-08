const fs = require('fs');
const isEmpty = require('../obj/isEmpty');

const getFileContent = filename => (
  (isEmpty(filename) || !fs.existsSync(filename))
    ? undefined
    : fs.readFileSync(filename, 'utf-8')
);

module.exports = getFileContent;
