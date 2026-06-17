const VALS = [1000,900,500,400,100,90,50,40,10,9,5,4,1];
const SYMS = ['M','CM','D','CD','C','XC','L','XL','X','IX','V','IV','I'];

export function toRoman(n) {
  let result = '';
  for (let i = 0; i < VALS.length; i++) {
    while (n >= VALS[i]) { result += SYMS[i]; n -= VALS[i]; }
  }
  return result;
}
