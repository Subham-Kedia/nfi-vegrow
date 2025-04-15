export const onFilterbyIdTabChange = (counts, objConst) => {
  return Object.values(objConst).find((obj) => !!counts[obj.value])?.value;
};
