import isNumeric from '../string/isNumeric';

const percentile = (data, percent) => {

  if (data.length === 0) return null;

  let error = false;
  const mappedData = data.map((el) => {
    if (typeof el === 'number') return el;
    if (!isNumeric(el)) error = true;
    return parseFloat(el);
  });
  mappedData.sort((a, b) => a - b);

  return (error ? null : mappedData[Math.ceil(percent * data.length)]);

};

export default percentile;
