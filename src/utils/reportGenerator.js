/**
 * Report Generator Utility
 * 
 * Generates analysis reports in different formats
 */

/**
 * Generate analysis report
 * @param {Array} results - Analysis results array
 * @param {Object} options - Report options
 * @returns {string} Formatted report
 */
function generateReport(results, options = {}) {
  const { format = 'text', threshold = 70 } = options;
  
  switch (format) {
    case 'json':
      return JSON.stringify({ results, threshold, generatedAt: new Date().toISOString() }, null, 2);
    case 'markdown':
      return generateMarkdownReport(results, threshold);
    case 'text':
    default:
      return generateTextReport(results, threshold);
  }
}

/**
 * Generate text format report
 */
function generateTextReport(results, threshold) {
  let report = '';
  report += '='.repeat(60) + '\n';
  report += '           CODE QUALITY ANALYSIS REPORT\n';
  report += '='.repeat(60) + '\n\n';
  
  // Summary
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
    : 0;
  
  report += `Files Analyzed: ${results.length}\n`;
  report += `Average Score: ${avgScore}/100\n`;
  report += `Threshold: ${threshold}/100\n`;
  report += `Status: ${avgScore >= threshold ? '✅ PASS' : '❌ FAIL'}\n\n`;
  
  // Per-file results
  results.forEach(result => {
    report += '-'.repeat(60) + '\n';
    report += `📄 ${result.filePath}\n`;
    report += `   Score: ${result.overallScore}/100 ${getScoreIndicator(result.overallScore)}\n\n`;
    
    // Details
    Object.entries(result.details).forEach(([category, data]) => {
      report += `   ${getCategoryLabel(category)}: ${data.score}/100\n`;
      
      if (category === 'complexity' && data.highComplexityFunctions.length > 0) {
        report += `      ⚠️  High complexity functions:\n`;
        data.highComplexityFunctions.forEach(fn => {
          report += `         - ${fn.name} (line ${fn.startLine}, complexity: ${fn.complexity})\n`;
        });
      }
      
      if (category === 'naming' && data.issues.length > 0) {
        report += `      ⚠️  Naming issues: ${data.issues.length}\n`;
      }
      
      if (category === 'errorHandling' && data.issues.length > 0) {
        report += `      ⚠️  Error handling issues: ${data.issues.length}\n`;
      }
      
      if (category === 'documentation') {
        report += `      📝 Documentation coverage: ${data.coveragePercentage}%\n`;
      }
    });
    
    // Recommendations
    if (result.recommendations.length > 0) {
      report += '\n   💡 Recommendations:\n';
      result.recommendations.forEach(rec => {
        report += `      [${rec.severity.toUpperCase()}] ${rec.message}\n`;
      });
    }
    
    report += '\n';
  });
  
  report += '='.repeat(60) + '\n';
  
  return report;
}

/**
 * Generate markdown format report
 */
function generateMarkdownReport(results, threshold) {
  let report = '# Code Quality Analysis Report\n\n';
  
  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.overallScore, 0) / results.length)
    : 0;
  
  report += `## Summary\n\n`;
  report += `| Metric | Value |\n`;
  report += `|--------|-------|\n`;
  report += `| Files Analyzed | ${results.length} |\n`;
  report += `| Average Score | ${avgScore}/100 |\n`;
  report += `| Threshold | ${threshold}/100 |\n`;
  report += `| Status | ${avgScore >= threshold ? '✅ PASS' : '❌ FAIL'} |\n\n`;
  
  results.forEach(result => {
    report += `## ${result.filePath}\n\n`;
    report += `**Score: ${result.overallScore}/100** ${getScoreIndicator(result.overallScore)}\n\n`;
    
    report += `### Details\n\n`;
    report += `| Category | Score |\n`;
    report += `|----------|-------|\n`;
    
    Object.entries(result.details).forEach(([category, data]) => {
      report += `| ${getCategoryLabel(category)} | ${data.score}/100 |\n`;
    });
    
    if (result.recommendations.length > 0) {
      report += `\n### Recommendations\n\n`;
      result.recommendations.forEach(rec => {
        report += `- **[${rec.severity.toUpperCase()}]** ${rec.message}\n`;
      });
    }
    
    report += '\n---\n\n';
  });
  
  return report;
}

/**
 * Get score indicator emoji
 */
function getScoreIndicator(score) {
  if (score >= 90) return '🌟';
  if (score >= 80) return '✨';
  if (score >= 70) return '👍';
  if (score >= 60) return '⚠️';
  return '❌';
}

/**
 * Get category label
 */
function getCategoryLabel(category) {
  const labels = {
    complexity: 'Complexity',
    naming: 'Naming',
    errorHandling: 'Error Handling',
    documentation: 'Documentation'
  };
  return labels[category] || category;
}

module.exports = { generateReport };