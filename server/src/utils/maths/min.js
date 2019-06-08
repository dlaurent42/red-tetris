const isNumeric = require('../string/isNumeric');

const min = (data) => {

  if (data.length === 0) return null;

  let error = false;
  let minimum = null;
  data.forEach((el) => {
    if (typeof el === 'number') minimum = (minimum === null || minimum > el) ? el : minimum;
    else if (!isNumeric(el)) error = true;
    else {
      const num = parseFloat(el);
      if (minimum === null || minimum > num) minimum = num;
    }
  });

  return (error ? null : minimum);
};

module.exports = min;
