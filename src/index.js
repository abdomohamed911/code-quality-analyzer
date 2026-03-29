/**
 * Code Quality Analyzer - Main Entry Point
 * 
 * Analyzes JavaScript/TypeScript files for:
 * - Cyclomatic complexity
 * - Naming conventions
 * - Error handling patterns
 * - Documentation coverage
 * 
 * @author Abdelrahman Mohamed
 */

const { Command } = require('commander');
const fs = require('fs');
const path = require('path');
const { analyzeCode } = require('./analyzer');
const { generateReport } = require('./utils/reportGenerator');
const { parseFile, parseDirectory } = require('./utils/fileParser');

const program = new Command();

program
  .name('code-quality-analyzer')
  .description('Static code analysis tool for JavaScript/TypeScript')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze code quality of a file or directory')
  .argument('<path>', 'Path to file or directory to analyze')
  .option('-o, --output <format>', 'Output format (json, text, markdown)', 'text')
  .option('-t, --threshold <number>', 'Quality score threshold (0-100)', '70')
  .action(async (filePath, options) => {
    try {
      console.log(`\n🔍 Analyzing: ${filePath}\n`);
      
      let results = [];
      
      if (fs.statSync(filePath).isDirectory()) {
        const files = parseDirectory(filePath);
        for (const file of files) {
          const content = parseFile(file);
          if (content) {
            const analysis = analyzeCode(content, file);
            results.push(analysis);
          }
        }
      } else {
        const content = parseFile(filePath);
        if (content) {
          const analysis = analyzeCode(content, filePath);
          results.push(analysis);
        }
      }
      
      const report = generateReport(results, {
        format: options.output,
        threshold: parseInt(options.threshold, 10)
      });
      
      console.log(report);
      
      // Exit with error code if below threshold
      const avgScore = results.reduce((sum, r) => sum + r.overallScore, 0) / results.length;
      if (avgScore < parseInt(options.threshold, 10)) {
        process.exit(1);
      }
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  });

program.parse();