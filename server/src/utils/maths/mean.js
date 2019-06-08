const isNumeric = require('../string/isNumeric');

const mean = (data) => {

  if (data.length === 0) return null;

  let error = false;
  let sum = 0;
  data.forEach((el) => {
    if (typeof el === 'number') sum += el;
    else if (!isNumeric(el)) error = true;
    else sum += parseFloat(el);
  });

  return (error ? null : sum / data.length);
};

module.exports = mean;
