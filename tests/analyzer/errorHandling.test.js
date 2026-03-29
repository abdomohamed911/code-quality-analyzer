const { analyzeErrorHandling } = require('../../src/analyzer/errorHandling');

describe('Error Handling Analyzer', () => {
  it('should return high score for code with proper error handling', () => {
    const code = `
      async function fetchData() {
        try {
          const response = await fetch(url);
          return await response.json();
        } catch (error) {
          console.error('Failed to fetch:', error.message);
          throw error;
        }
      }
    `;
    const result = analyzeErrorHandling(code);
    expect(result.score).toBeGreaterThan(70);
  });
  
  it('should flag async functions without try-catch', () => {
    const code = `
      async function badFetch() {
        const response = await fetch(url);
        return response.json();
      }
    `;
    const result = analyzeErrorHandling(code);
    const missingTryCatch = result.issues.filter(i => i.type === 'missing_try_catch');
    expect(missingTryCatch.length).toBeGreaterThan(0);
  });
  
  it('should count async functions correctly', () => {
    const code = `
      async function a() {}
      async function b() {}
      function c() {}
    `;
    const result = analyzeErrorHandling(code);
    expect(result.asyncFunctionsCount).toBe(2);
  });
  
  it('should count try-catch blocks correctly', () => {
    const code = `
      function a() { try {} catch(e) {} }
      function b() { try {} catch(e) {} try {} catch(e) {} }
    `;
    const result = analyzeErrorHandling(code);
    expect(result.tryCatchCount).toBe(3);
  });
  
  it('should identify good patterns like custom error classes', () => {
    const code = `
      class ValidationError extends Error {
        constructor(message) {
          super(message);
          this.name = 'ValidationError';
        }
      }
    `;
    const result = analyzeErrorHandling(code);
    const customErrorPattern = result.goodPatterns.find(p => p.type === 'custom_error_class');
    expect(customErrorPattern).toBeDefined();
  });
  
  it('should identify error logging pattern', () => {
    const code = `
      try { risky(); } catch(e) { console.error(e); }
    `;
    const result = analyzeErrorHandling(code);
    const loggingPattern = result.goodPatterns.find(p => p.type === 'error_logging');
    expect(loggingPattern).toBeDefined();
  });
  
  it('should flag unused error variables', () => {
    const code = `
      try { risky(); } catch(error) { /* ignored */ }
    `;
    const result = analyzeErrorHandling(code);
    const unusedError = result.issues.filter(i => i.type === 'unused_error');
    expect(unusedError.length).toBeGreaterThan(0);
  });
  
  it('should not flag when error is used', () => {
    const code = `
      try { risky(); } catch(error) { console.error(error.message); }
    `;
    const result = analyzeErrorHandling(code);
    const unusedError = result.issues.filter(i => i.type === 'unused_error');
    expect(unusedError.length).toBe(0);
  });
  
  it('should handle code with no async functions', () => {
    const code = `function simple() { return 1; }`;
    const result = analyzeErrorHandling(code);
    expect(result.asyncFunctionsCount).toBe(0);
  });
});
