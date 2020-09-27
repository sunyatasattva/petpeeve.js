export function pipe (...funcs: ((...args: any[]) => any)[]) {
  return (x: any) => funcs.reduce((v, f) => f(v), x);
}
