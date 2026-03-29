const { analyzeComplexity } = require('./complexity');
const { analyzeNaming } = require('./naming');
const { analyzeErrorHandling } = require('./errorHandling');
const { analyzeDocumentation } = require('./documentation');

function analyzeCode(code, filePath) {
  const complexityResults = analyzeComplexity(code);
  const namingResults = analyzeNaming(code);
  const errorHandlingResults = analyzeErrorHandling(code);
  const documentationResults = analyzeDocumentation(code);
  
  // Calculate weighted overall score
  const weights = {
    complexity: 0.30,
    naming: 0.25,
    errorHandling: 0.25,
    documentation: 0.20
  };
  
  const overallScore = Math.round(
    complexityResults.score * weights.complexity +
    namingResults.score * weights.naming +
    errorHandlingResults.score * weights.errorHandling +
    documentationResults.score * weights.documentation
  );
  
  return {
    filePath,
    overallScore,
    timestamp: new Date().toISOString(),
    details: {
      complexity: complexityResults,
      naming: namingResults,
      errorHandling: errorHandlingResults,
      documentation: documentationResults
    },
    recommendations: generateRecommendations({
      complexity: complexityResults,
      naming: namingResults,
      errorHandling: errorHandlingResults,
      documentation: documentationResults
    })
  };
}

function generateRecommendations(results) {
  const recommendations = [];
  
  if (results.complexity.score < 70) {
    recommendations.push({
      category: 'Complexity',
      severity: 'high',
      message: 'Consider refactoring functions with high cyclomatic complexity. Break down complex logic into smaller, focused functions.',
      details: `Found ${results.complexity.highComplexityFunctions.length} functions exceeding complexity threshold.`
    });
  }
  
  if (results.naming.score < 70) {
    recommendations.push({
      category: 'Naming',
      severity: 'medium',
      message: 'Improve variable and function naming. Use descriptive, intention-revealing names.',
      details: `Found ${results.naming.issues.length} naming convention issues.`
    });
  }
  
  if (results.errorHandling.score < 60) {
    recommendations.push({
      category: 'Error Handling',
      severity: 'high',
      message: 'Add proper error handling for async operations and edge cases. Use try-catch blocks appropriately.',
      details: 'Missing error handling in critical code paths.'
    });
  }
  
  if (results.documentation.score < 50) {
    recommendations.push({
      category: 'Documentation',
      severity: 'low',
      message: 'Add JSDoc comments to exported functions and complex logic.',
      details: `Documentation coverage: ${results.documentation.coveragePercentage}%`
    });
  }
  
  return recommendations;
}

module.exports = { analyzeCode };
