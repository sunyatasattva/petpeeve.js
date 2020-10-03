import { pipe } from "./lib/utils";
import * as Operations from "./lib/operations";
import { Options } from "./lib/types";

const defaultOptionsFactory = (v: boolean) => Object.keys(Operations)
  .reduce((acc, curr) => {
    acc[curr as keyof Options] = v;
    return acc;
  }, {} as Options);

function initializeFunctions(opts: Options) {
  const orderedOperations = [
    "removeExtraSpaces",
    "fixEndingPunctuation",
    "smartPunctuation",
    "smartDialogMarkers",
    "periodOutsideBrackets",
    "removeExtraPunctuation",
    "fixPunctuationSpace",
    "capitalizeSentences"
  ];

  const actualOpts = Object.values(opts).every(o => !o)
    ? { ...defaultOptionsFactory(true), ...opts }
    : opts;

  return orderedOperations
    .filter(k => actualOpts[k as keyof Options])
    .map(k => Operations[k as keyof Options]);
}

export default function PetPeeve (opts: Options = defaultOptionsFactory(true)) {
  let initializedFunctions = initializeFunctions(opts);

  return (string: string, opts?: Options) => {
    if(opts) initializedFunctions = initializeFunctions(opts);

    return pipe(...initializedFunctions)(string);
  }
}

export { Operations };
