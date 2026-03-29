function analyzeDocumentation(code) {
  const functions = extractDocumentableItems(code);
  const documentedFunctions = functions.filter(fn => fn.hasDocumentation);
  
  const fileDocumentation = checkFileDocumentation(code);
  
  const coveragePercentage = functions.length > 0
    ? Math.round((documentedFunctions.length / functions.length) * 100)
    : 0;
  
  const score = calculateDocumentationScore(coveragePercentage, fileDocumentation);
  
  return {
    score,
    coveragePercentage,
    totalFunctions: functions.length,
    documentedCount: documentedFunctions.length,
    undocumentedFunctions: functions.filter(fn => !fn.hasDocumentation),
    hasFileDocumentation: fileDocumentation,
    functions
  };
}

function extractDocumentableItems(code) {
  const functions = [];
  const funcRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(?:export\s+)?(?:async\s+)?(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>))/g;
  let match;
  
  while ((match = funcRegex.exec(code)) !== null) {
    const name = match[1] || match[2];
    const fullMatch = match[0];
    const hasJSDoc = fullMatch.startsWith('
function parseJSDoc(jsdocString) {
  const clean = jsdocString
    .replace(/^\s*\*\s?/gm, '')
    .trim();
  
  return {
    description: clean.split('\n')[0] || '',
    hasParams: /@param/.test(clean),
    hasReturns: /@returns?/.test(clean),
    hasExamples: /@example/.test(clean),
    raw: clean
  };
}

function checkFileDocumentation(code) {
  const firstLine = code.trim().split('\n')[0];
  return firstLine.startsWith('
function calculateDocumentationScore(coverage, hasFileDoc) {
  let score = coverage; // Base score from coverage
  
  // Bonus for file documentation
  if (hasFileDoc) score += 10;
  
  // Penalty if coverage is very low
  if (coverage < 30) score -= 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { analyzeDocumentation };
