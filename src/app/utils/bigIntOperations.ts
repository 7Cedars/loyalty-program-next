
// see https://stackoverflow.com/questions/61323821/alternative-to-math-max-and-math-min-for-bigint-type-in-javascript
export const bigIntMax = (args: BigInt[]) => args.reduce((m, e) => e > m ? e : m);
export const bigIntMin = (args: BigInt[]) => args.reduce((m, e) => e < m ? e : m);

