const isNumeric = (input) => {
  if (typeof input === 'string') return (/^(-|\+)?\d+(\.\d+)?$/.test(input));
  if (Array.isArray(input)) {
    let isNum = true;
    input.forEach((el) => {
      if (/^(-|\+)?(\d+(\.\d+)?)$/.test(el) === false && typeof el !== 'number') isNum = false;
    });
    isNum = (input.length) ? isNum : false;
    return isNum;
  }
  return false;
};

export default isNumeric;
