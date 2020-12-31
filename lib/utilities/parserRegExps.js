// TODO: this is getting absurd, consider switching to peg.js
const optionalWhitespace = "\\s*";
const startOfString = `^${optionalWhitespace}`;
const optionalDeclKeywordRegexp = "(?:(?<declKeyword>var|let|const)\\b)?";
const variableName = "(?<varName>\\w+)";
const assignmentOperator = "(?<assignmentOperator>=)";
const optionalAssignmentStmt = `(?<assignmentStmt>${optionalWhitespace + optionalDeclKeywordRegexp + optionalWhitespace + variableName + optionalWhitespace + assignmentOperator + optionalWhitespace})?`;
const docComparatorFront = "(?<getDocFront>\\?{1,2})?";
// eslint-disable-next-line jsdoc/require-jsdoc
const optionalMatchNamedMagicSymbol = (magicSymbol) => `(?<magicSymbol>${magicSymbol})?`;
// eslint-disable-next-line jsdoc/require-jsdoc
const matchNamedMagicSymbol = (magicSymbol) => `(?<magicSymbol>${magicSymbol})`;
// eslint-disable-next-line jsdoc/require-jsdoc
const matchNamedMagicString = (magicString) => `(?<cmdName>${magicString})`;
const docComparatorBack = "(?<getDocBack>\\?{1,2})?( |\\n|$)";
const anyWord = "\\w+";
const anyMagicSymbol = matchNamedMagicSymbol("\\W+");
const anyMagic = matchNamedMagicString("\\w+");
const endOfWord = "\\b";

const parserRegExps = {
    startOfString,
    optionalWhitespace,
    optionalDeclKeywordRegexp,
    variableName,
    assignmentOperator,
    optionalAssignmentStmt,
    docComparatorFront,
    optionalMatchNamedMagicSymbol,
    matchNamedMagicSymbol,
    matchNamedMagicString,
    docComparatorBack,
    anyWord,
    anyMagicSymbol,
    anyMagic,
    endOfWord,
};

module.exports = {
    parserRegExps,
};
