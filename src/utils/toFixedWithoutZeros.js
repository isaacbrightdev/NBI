const toFixedWithoutZeros = (num, precision) =>
  Number(num).toFixed(precision).replace(/\.0+$/, '');

// toFixedWithoutZeros(1.001, 2); // '1'
// toFixedWithoutZeros(1.500, 2); // '1.50'

export default toFixedWithoutZeros;
