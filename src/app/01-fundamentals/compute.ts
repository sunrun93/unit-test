export function compute (number) {
  if (number < 0) {
      number = 0;
      return number;
  } else {
    return number + 1;
  }
}
