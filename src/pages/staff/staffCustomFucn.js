export const areasSubareasChecked = (areaID, subAreas) => {
  const areaSubareas = subAreas.filter((sub) => sub.area === areaID);

  let everyCheck;

  if (areaSubareas.length > 0) {
    everyCheck = areaSubareas.every((val) => val.isChecked);
  }

  return everyCheck;
};
