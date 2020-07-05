export function pipe (...funcs: Function[]) {
  return (x: any) => funcs.reduce((v, f) => f(v), x);
}
