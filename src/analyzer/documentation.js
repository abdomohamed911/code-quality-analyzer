/**
 * Documentation Coverage Analyzer
 * 
 * Checks for:
 * - JSDoc comments on functions
 * - File-level documentation
 * - Parameter documentation
 * - Return type documentation
 */

/**
 * Analyze documentation coverage
 * @param {string} code - Source code
 * @returns {Object} Documentation analysis results
 */
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

/**
 * Extract functions and check for documentation
 */
function extractDocumentableItems(code) {
  const functions = [];
  const funcRegex = /(?:\/\*\*[\s\S]*?\*\/\s*)?(?:export\s+)?(?:async\s+)?(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>))/g;
  let match;
  
  while ((match = funcRegex.exec(code)) !== null) {
    const name = match[1] || match[2];
    const fullMatch = match[0];
    const hasJSDoc = fullMatch.startsWith('/**');
    
    // Extract JSDoc if present
    let jsdoc = null;
    if (hasJSDoc) {
      const jsdocMatch = fullMatch.match(/\/\*\*([\s\S]*?)\*\//);
      if (jsdocMatch) {
        jsdoc = parseJSDoc(jsdocMatch[1]);
      }
    }
    
    const line = code.substring(0, match.index).split('\n').length;
    
    functions.push({
      name,
      line,
      hasDocumentation: hasJSDoc,
      jsdoc
    });
  }
  
  return functions;
}

/**
 * Parse JSDoc comment
 */
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

/**
 * Check for file-level documentation
 */
function checkFileDocumentation(code) {
  const firstLine = code.trim().split('\n')[0];
  return firstLine.startsWith('/**');
}

/**
 * Calculate documentation score
 */
function calculateDocumentationScore(coverage, hasFileDoc) {
  let score = coverage; // Base score from coverage
  
  // Bonus for file documentation
  if (hasFileDoc) score += 10;
  
  // Penalty if coverage is very low
  if (coverage < 30) score -= 10;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { analyzeDocumentation };