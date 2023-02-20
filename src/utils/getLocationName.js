//for select divisional area name
const getName = (array, matchValue) => {
  return array.find((item) => item.id === matchValue);
};

export default getName;
