const COMPLEXITY_THRESHOLD = 10;
const HIGH_COMPLEXITY_THRESHOLD = 15;

function analyzeComplexity(code) {
  const functions = extractFunctions(code);
  const functionAnalyses = functions.map(fn => ({
    name: fn.name,
    startLine: fn.startLine,
    complexity: calculateComplexity(fn.body),
    lines: fn.lineCount
  }));
  
  const highComplexityFunctions = functionAnalyses.filter(
    fn => fn.complexity > HIGH_COMPLEXITY_THRESHOLD
  );
  
  const avgComplexity = functionAnalyses.length > 0
    ? functionAnalyses.reduce((sum, fn) => sum + fn.complexity, 0) / functionAnalyses.length
    : 0;
  
  const score = calculateComplexityScore(functionAnalyses);
  
  return {
    score,
    averageComplexity: Math.round(avgComplexity * 100) / 100,
    functionCount: functionAnalyses.length,
    highComplexityFunctions,
    threshold: COMPLEXITY_THRESHOLD,
    functions: functionAnalyses
  };
}

function extractFunctions(code) {
  const lines = code.split('\n');
  const functions = [];
  const functionRegex = /(?:function\s+(\w+)|(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s*)?(?:function|\([^)]*\)\s*=>))/g;
  let match;
  
  while ((match = functionRegex.exec(code)) !== null) {
    const name = match[1] || match[2];
    const startLine = code.substring(0, match.index).split('\n').length;
    const body = extractFunctionBody(code, match.index);
    const lineCount = body.split('\n').length;
    
    functions.push({ name, startLine, body, lineCount });
  }
  
  return functions;
}

function extractFunctionBody(code, startIndex) {
  let braceCount = 0;
  let started = false;
  let endIndex = startIndex;
  
  for (let i = startIndex; i < code.length; i++) {
    if (code[i] === '{') {
      braceCount++;
      started = true;
    } else if (code[i] === '}') {
      braceCount--;
      if (started && braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  
  return code.substring(startIndex, endIndex);
}

function calculateComplexity(code) {
  let complexity = 1; // Base complexity
  
  // Decision points
  const decisionPatterns = [
    /\bif\b/g,
    /\belse\s+if\b/g,
    /\bfor\b/g,
    /\bwhile\b/g,
    /\bdo\b/g,
    /\bcase\b/g,
    /\?\s*[^?]/g,  // Ternary (not nullish coalescing)
    /&&/g,
    /\|\|/g
  ];
  
  decisionPatterns.forEach(pattern => {
    const matches = code.match(pattern);
    if (matches) {
      complexity += matches.length;
    }
  });
  
  // Subtract catch blocks (they don't add to complexity)
  const catchMatches = code.match(/\bcatch\b/g);
  if (catchMatches) {
    complexity -= catchMatches.length;
  }
  
  return Math.max(1, complexity);
}

function calculateComplexityScore(functions) {
  if (functions.length === 0) return 100;
  
  let penalty = 0;
  let bonus = 0;
  
  functions.forEach(fn => {
    if (fn.complexity > HIGH_COMPLEXITY_THRESHOLD) {
      penalty += (fn.complexity - HIGH_COMPLEXITY_THRESHOLD) * 5;
    } else if (fn.complexity <= 5) {
      bonus += 5;
    } else if (fn.complexity <= COMPLEXITY_THRESHOLD) {
      bonus += 2;
    }
  });
  
  const baseScore = 100 - penalty + (bonus / functions.length);
  return Math.max(0, Math.min(100, Math.round(baseScore)));
}

module.exports = { analyzeComplexity, calculateComplexity, COMPLEXITY_THRESHOLD };
