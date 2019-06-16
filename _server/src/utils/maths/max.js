import isNumeric from '../string/isNumeric';

const max = (data) => {

  if (data.length === 0) return null;

  let error = false;
  let maximum = null;
  data.forEach((el) => {
    if (typeof el === 'number') maximum = (maximum === null || maximum < el) ? el : maximum;
    else if (!isNumeric(el)) error = true;
    else {
      const num = parseFloat(el);
      if (maximum === null || maximum < num) maximum = num;
    }
  });

  return (error ? null : maximum);
};

export default max;
