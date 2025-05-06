export const arraysAreEqual = (
  array1: Array<string | number>,
  array2: Array<string | number>,
) =>
  array1.length === array2.length &&
  array1.every((element, index) => element === array2[index]);
