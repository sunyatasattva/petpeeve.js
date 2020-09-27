export function capitalizeSentences (string: string) {
  return string.replace(
    /(^[\W]*?|[.|!|?]\s*?|\n[\W]*?\s*?)([a-z])/gi,
    (_, $1, $2) => `${$1}${$2.toUpperCase()}`
  );
}

export function fixEndingPunctuation (string: string) {
  const punctuation = "[^.|!|?|\n|»]";

  return string
    .replace(/^"(.*)"$/g, "«$1»")
    .replace(new RegExp(`(${punctuation})(\n\\s?.)`, "gi"), "$1.$2")
    .replace(new RegExp(`(${punctuation}$)`), "$1.");
}

export function fixPunctuationSpace (string: string) {
  // @todo add spaceBefore/noSpaceBefore
  const spaceAfter = /(\.|,|:|;|\)|”|»|!|\?|…)([a-z|A-Z])/gi;
  const noSpaceAfter = /(«|“)(\s)/gi;

  return string
    .replace(spaceAfter, "$1 $2")
    .replace(noSpaceAfter, "$1");
}

export function smartDialogMarkers (string: string) {
  return string
    .replace(/(^|\n)(-\s?)(.*)/gi, "$1«$3»");
}

export function smartPunctuation (string: string) {
  return string
    .replace(/"\b/g, "\u201C") // "a -> ”a
    .replace(/\b"/g, "\u201D") // a" -> a”
    .replace(/<</g, "\u00AB") // << -> «
    .replace(/>>/g, "\u00BB") // >> -> »
    .replace(/---/g, "\u2014") // --- -> em-dash
    .replace(/--/g, "\u2013") // -- -> en-dash
    .replace(/(\.\.\.|\. \. \.|\. \.)/g, "\u2026"); // ..., . . ., . . -> …
}

export function periodOutsideBrackets (string: string) {
  return string.replace(/(\.)(\)|”)/, "$2$1");
}

export function removeExtraPunctuation (string: string) {
  // @todo should leave interrobang alone
  return string
    .replace(/(\.|,|\?|!|\u2026){2,}/g, "$1")
    .replace(/(\u2026)(\.)/, "$1");
}

export function removeExtraSpaces (string: string) {
  return string
    .replace(/[^\S\r\n]{2,}/g, " ")
    .replace(/\s\n/, "\n")
    .replace(/\n\s/, "\n")
    .trim();
}
