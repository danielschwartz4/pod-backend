export default function removeItem<T>(arr: T[], value: T): T[] {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  console.log("ARR");
  console.log(arr);
  return arr;
}
