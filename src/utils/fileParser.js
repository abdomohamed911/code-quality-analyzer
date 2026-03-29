/**
 * File Parser Utility
 * 
 * Handles reading and parsing source files
 */

const fs = require('fs');
const path = require('path');

const SUPPORTED_EXTENSIONS = ['.js', '.jsx', '.ts', '.tsx', '.mjs'];

/**
 * Parse a single file and return its content
 * @param {string} filePath - Path to the file
 * @returns {string|null} File content or null if unsupported
 */
function parseFile(filePath) {
  const ext = path.extname(filePath);
  
  if (!SUPPORTED_EXTENSIONS.includes(ext)) {
    return null;
  }
  
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file: ${filePath} - ${error.message}`);
  }
}

/**
 * Parse all supported files in a directory
 * @param {string} dirPath - Path to the directory
 * @returns {string[]} Array of file paths
 */
function parseDirectory(dirPath) {
  const files = [];
  
  function walkDirectory(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      // Skip common non-source directories
      if (entry.isDirectory()) {
        const skipDirs = ['node_modules', '.git', 'dist', 'build', 'coverage'];
        if (!skipDirs.includes(entry.name)) {
          walkDirectory(fullPath);
        }
      } else {
        const ext = path.extname(entry.name);
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  walkDirectory(dirPath);
  return files;
}

module.exports = { parseFile, parseDirectory, SUPPORTED_EXTENSIONS };