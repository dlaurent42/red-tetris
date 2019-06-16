import fs from 'fs';
import isEmpty from '../obj/isEmpty';

const getFileContent = filename => (
  (isEmpty(filename) || !fs.existsSync(filename))
    ? undefined
    : fs.readFileSync(filename, 'utf-8')
);

export default getFileContent;
