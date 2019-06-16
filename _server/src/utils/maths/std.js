import mean from './mean';

const std = (data) => {

  const meanValue = mean(data);

  if (meanValue === null) return null;

  let sum = 0;
  data.forEach((el) => {
    sum += (typeof el === 'number') ? el ** 2 : parseFloat(el) ** 2;
  });

  return (sum / data.length) ** 0.5;

};

export default std;
