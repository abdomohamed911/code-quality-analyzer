/**
 * Error Handling Analyzer
 * 
 * Checks for:
 * - try-catch blocks around async operations
 * - Proper error propagation
 * - Error type checking
 * - Sync errors in async functions
 * - Unhandled promise rejections
 */

/**
 * Analyze error handling patterns in code
 * @param {string} code - Source code
 * @returns {Object} Error handling analysis results
 */
function analyzeErrorHandling(code) {
  const issues = [];
  const patterns = [];
  
  // Check async functions without try-catch
  checkAsyncFunctions(code, issues);
  
  // Check promise handling
  checkPromiseHandling(code, issues);
  
  // Check error type checking
  checkErrorTypeChecking(code, issues);
  
  // Identify good patterns
  identifyGoodPatterns(code, patterns);
  
  const score = calculateErrorHandlingScore(issues, patterns, code);
  
  return {
    score,
    issues,
    goodPatterns: patterns,
    asyncFunctionsCount: countAsyncFunctions(code),
    tryCatchCount: countTryCatch(code)
  };
}

/**
 * Check if async functions have proper error handling
 */
function checkAsyncFunctions(code, issues) {
  const asyncFuncRegex = /async\s+(?:function\s+(\w+)|(?:\([^)]*\)\s*=>|\w+\s*=>))/g;
  const tryCatchRegex = /try\s*\{/g;
  const lineNumbers = getLineNumbers(code);
  let match;
  
  // Find all try-catch positions
  const tryCatchPositions = [];
  while ((match = tryCatchRegex.exec(code)) !== null) {
    const endPos = findMatchingBrace(code, match.index + match[0].length - 1);
    tryCatchPositions.push({ start: match.index, end: endPos });
  }
  
  // Reset regex
  asyncFuncRegex.lastIndex = 0;
  
  while ((match = asyncFuncRegex.exec(code)) !== null) {
    const name = match[1] || 'anonymous';
    const funcStart = match.index;
    const funcEnd = findFunctionEnd(code, funcStart);
    const line = lineNumbers[funcStart];
    
    // Check if this async function contains try-catch
    const hasTryCatch = tryCatchPositions.some(
      tc => tc.start > funcStart && tc.end < funcEnd
    );
    
    // Check if it contains await (which might need error handling)
    const hasAwait = /await\s+/.test(code.substring(funcStart, funcEnd));
    
    if (hasAwait && !hasTryCatch) {
      issues.push({
        type: 'missing_try_catch',
        function: name,
        line,
        message: `Async function '${name}' uses await but lacks try-catch error handling`,
        severity: 'high'
      });
    }
  }
}

/**
 * Check promise handling (.then/.catch vs await)
 */
function checkPromiseHandling(code, issues) {
  // Look for .then without .catch
  const thenRegex = /\.then\s*\(/g;
  const catchRegex = /\.catch\s*\(/g;
  const lineNumbers = getLineNumbers(code);
  let match;
  
  const thenPositions = [];
  while ((match = thenRegex.exec(code)) !== null) {
    thenPositions.push(match.index);
  }
  
  const catchPositions = [];
  while ((match = catchRegex.exec(code)) !== null) {
    catchPositions.push(match.index);
  }
  
  thenPositions.forEach(pos => {
    const line = lineNumbers[pos];
    // Simple heuristic: if there's no .catch after .then in same chain
    const nextCatch = catchPositions.find(cp => cp > pos);
    const nextThen = thenPositions.find(tp => tp > pos && tp !== pos);
    
    if (!nextCatch || (nextThen && nextThen < nextCatch)) {
      issues.push({
        type: 'missing_catch',
        line,
        message: 'Promise chain with .then() missing .catch() handler',
        severity: 'high'
      });
    }
  });
}

/**
 * Check if errors are properly typed
 */
function checkErrorTypeChecking(code, issues) {
  const catchRegex = /catch\s*\(\s*(\w+)\s*\)/g;
  const lineNumbers = getLineNumbers(code);
  let match;
  
  while ((match = catchRegex.exec(code)) !== null) {
    const errorVar = match[1];
    const catchStart = match.index;
    const catchEnd = findMatchingBrace(code, match.index + match[0].length - 1);
    const catchBlock = code.substring(catchStart, catchEnd);
    const line = lineNumbers[catchStart];
    
    // Check if error is used at all
    if (!catchBlock.includes(errorVar)) {
      issues.push({
        type: 'unused_error',
        line,
        message: `Caught error '${errorVar}' is not used. Consider logging or handling it.`,
        severity: 'low'
      });
    }
    
    // Check for proper error type checking
    const hasTypeCheck = catchBlock.includes('instanceof Error') ||
                         catchBlock.includes('instanceof TypeError') ||
                         catchBlock.includes('instanceof SyntaxError') ||
                         catchBlock.includes('.message') ||
                         catchBlock.includes('.stack');
    
    if (!hasTypeCheck && catchBlock.includes(errorVar)) {
      issues.push({
        type: 'no_type_check',
        line,
        message: `Error '${errorVar}' is used without type checking. Consider checking 'instanceof Error'.`,
        severity: 'low'
      });
    }
  }
}

/**
 * Identify good error handling patterns
 */
function identifyGoodPatterns(code, patterns) {
  // Custom error classes
  if (/class\s+\w+Error\s+extends\s+Error/.test(code)) {
    patterns.push({
      type: 'custom_error_class',
      message: 'Uses custom error classes for better error categorization'
    });
  }
  
  // Error boundaries (React) or similar
  if (/ErrorBoundary/.test(code)) {
    patterns.push({
      type: 'error_boundary',
      message: 'Implements error boundary pattern for graceful error recovery'
    });
  }
  
  // Error logging
  if (/console\.error/.test(code) || /logger\.error/.test(code)) {
    patterns.push({
      type: 'error_logging',
      message: 'Properly logs errors for debugging'
    });
  }
  
  // Error re-throwing with context
  if (/throw\s+new\s+Error/.test(code) && /catch/.test(code)) {
    patterns.push({
      type: 'error_context',
      message: 'Adds context when re-throwing errors'
    });
  }
}

/**
 * Helper: Find matching brace
 */
function findMatchingBrace(code, openBracePos) {
  let count = 1;
  let i = openBracePos + 1;
  
  while (i < code.length && count > 0) {
    if (code[i] === '{') count++;
    else if (code[i] === '}') count--;
    i++;
  }
  
  return i;
}

/**
 * Helper: Find function end
 */
function findFunctionEnd(code, startPos) {
  const braceStart = code.indexOf('{', startPos);
  if (braceStart === -1) return code.length;
  return findMatchingBrace(code, braceStart);
}

/**
 * Helper: Get line numbers
 */
function getLineNumbers(code) {
  const lines = code.split('\n');
  const positions = {};
  let pos = 0;
  
  lines.forEach((line, index) => {
    for (let i = 0; i <= line.length; i++) {
      positions[pos + i] = index + 1;
    }
    pos += line.length + 1;
  });
  
  return positions;
}

/**
 * Count async functions
 */
function countAsyncFunctions(code) {
  const matches = code.match(/async\s+/g);
  return matches ? matches.length : 0;
}

/**
 * Count try-catch blocks
 */
function countTryCatch(code) {
  const matches = code.match(/try\s*\{/g);
  return matches ? matches.length : 0;
}

/**
 * Calculate error handling score
 */
function calculateErrorHandlingScore(issues, patterns, code) {
  const asyncCount = countAsyncFunctions(code);
  let score = 70; // Base score
  
  // Penalty for issues
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'high': score -= 15; break;
      case 'medium': score -= 8; break;
      case 'low': score -= 3; break;
    }
  });
  
  // Bonus for good patterns
  patterns.forEach(() => score += 5);
  
  // Bonus if all async functions have try-catch
  if (asyncCount > 0) {
    const tryCatchCount = countTryCatch(code);
    if (tryCatchCount >= asyncCount * 0.8) {
      score += 10;
    }
  }
  
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { analyzeErrorHandling };