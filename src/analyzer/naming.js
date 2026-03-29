/**
 * Naming Convention Analyzer
 * 
 * Checks for:
 * - camelCase for variables and functions
 * - PascalCase for classes and constructors
 * - UPPER_SNAKE_CASE for constants
 * - Descriptive names (minimum length, no single letters except loop vars)
 * - No misleading names
 */

const MIN_VARIABLE_NAME_LENGTH = 3;
const EXCLUDED_SHORT_NAMES = ['i', 'j', 'k', 'x', 'y', 'z', 'e', '_', 'id', 'fn', 'cb'];

/**
 * Analyze naming conventions in code
 * @param {string} code - Source code
 * @returns {Object} Naming analysis results
 */
function analyzeNaming(code) {
  const issues = [];
  
  // Check variable declarations
  checkVariableDeclarations(code, issues);
  
  // Check function declarations
  checkFunctionDeclarations(code, issues);
  
  // Check class declarations
  checkClassDeclarations(code, issues);
  
  // Check constant declarations
  checkConstantDeclarations(code, issues);
  
  const score = calculateNamingScore(issues, code);
  
  return {
    score,
    issues,
    checkedCount: countDeclarations(code),
    conventions: {
      variables: 'camelCase',
      functions: 'camelCase',
      classes: 'PascalCase',
      constants: 'UPPER_SNAKE_CASE'
    }
  };
}

/**
 * Check variable declarations for naming conventions
 */
function checkVariableDeclarations(code, issues) {
  const varRegex = /(?:const|let|var)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  let match;
  const lineNumbers = getLineNumbers(code);
  
  while ((match = varRegex.exec(code)) !== null) {
    const name = match[1];
    const line = lineNumbers[match.index];
    
    // Skip if it's a constant (uppercase)
    if (name === name.toUpperCase()) continue;
    
    // Check for camelCase
    if (!isCamelCase(name) && !isPascalCase(name)) {
      issues.push({
        type: 'variable',
        name,
        line,
        message: `Variable '${name}' should use camelCase naming convention`,
        severity: 'medium'
      });
    }
    
    // Check for descriptive names
    if (name.length < MIN_VARIABLE_NAME_LENGTH && !EXCLUDED_SHORT_NAMES.includes(name)) {
      issues.push({
        type: 'variable',
        name,
        line,
        message: `Variable '${name}' is too short. Use a descriptive name.`,
        severity: 'low'
      });
    }
  }
}

/**
 * Check function declarations for naming conventions
 */
function checkFunctionDeclarations(code, issues) {
  const funcRegex = /(?:function\s+|(?:(?:const|let|var)\s+)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>))\s*([a-zA-Z_$][a-zA-Z0-9_$]*)?/g;
  const lineNumbers = getLineNumbers(code);
  let match;
  
  while ((match = funcRegex.exec(code)) !== null) {
    const name = match[1] || match[2];
    if (!name) continue;
    
    const line = lineNumbers[match.index];
    
    if (!isCamelCase(name)) {
      issues.push({
        type: 'function',
        name,
        line,
        message: `Function '${name}' should use camelCase naming convention`,
        severity: 'medium'
      });
    }
    
    // Functions should be verbs or verb phrases
    const commonVerbPrefixes = ['get', 'set', 'is', 'has', 'can', 'should', 'will', 'did', 'do', 'handle', 'process', 'create', 'update', 'delete', 'fetch', 'load', 'save', 'validate', 'check', 'find', 'filter', 'map', 'reduce', 'transform', 'parse', 'format', 'calculate', 'compute', 'generate', 'build', 'make', 'init', 'setup', 'teardown', 'destroy', 'open', 'close', 'start', 'stop', 'pause', 'resume', 'send', 'receive', 'handle', 'on', 'emit'];
    
    const isVerbLike = commonVerbPrefixes.some(prefix => 
      name.toLowerCase().startsWith(prefix)
    );
    
    if (!isVerbLike && name.length > 4) {
      issues.push({
        type: 'function',
        name,
        line,
        message: `Function '${name}' should start with a verb (e.g., get, set, is, handle, calculate)`,
        severity: 'low'
      });
    }
  }
}

/**
 * Check class declarations for PascalCase
 */
function checkClassDeclarations(code, issues) {
  const classRegex = /class\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
  const lineNumbers = getLineNumbers(code);
  let match;
  
  while ((match = classRegex.exec(code)) !== null) {
    const name = match[1];
    const line = lineNumbers[match.index];
    
    if (!isPascalCase(name)) {
      issues.push({
        type: 'class',
        name,
        line,
        message: `Class '${name}' should use PascalCase naming convention`,
        severity: 'medium'
      });
    }
  }
}

/**
 * Check constant declarations for UPPER_SNAKE_CASE
 */
function checkConstantDeclarations(code, issues) {
  const constRegex = /const\s+([A-Z][A-Z0-9_]*)/g;
  const lineNumbers = getLineNumbers(code);
  let match;
  
  while ((match = constRegex.exec(code)) !== null) {
    const name = match[1];
    const line = lineNumbers[match.index];
    
    if (name !== name.toUpperCase() || name.includes('__')) {
      issues.push({
        type: 'constant',
        name,
        line,
        message: `Constant '${name}' should use UPPER_SNAKE_CASE naming convention`,
        severity: 'low'
      });
    }
  }
}

/**
 * Helper: Check if string is camelCase
 */
function isCamelCase(str) {
  return /^[a-z][a-zA-Z0-9]*$/.test(str);
}

/**
 * Helper: Check if string is PascalCase
 */
function isPascalCase(str) {
  return /^[A-Z][a-zA-Z0-9]*$/.test(str);
}

/**
 * Get line number for each character position
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
 * Count total declarations in code
 */
function countDeclarations(code) {
  const patterns = [
    /(?:const|let|var)\s+/g,
    /function\s+/g,
    /class\s+/g
  ];
  
  let count = 0;
  patterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) count += matches.length;
  });
  
  return count;
}

/**
 * Calculate naming score
 */
function calculateNamingScore(issues, code) {
  const totalDeclarations = countDeclarations(code);
  if (totalDeclarations === 0) return 100;
  
  const severityWeights = { high: 15, medium: 8, low: 3 };
  let penalty = 0;
  
  issues.forEach(issue => {
    penalty += severityWeights[issue.severity] || 5;
  });
  
  const score = 100 - (penalty / totalDeclarations);
  return Math.max(0, Math.min(100, Math.round(score)));
}

module.exports = { analyzeNaming, isCamelCase, isPascalCase };