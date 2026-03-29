const { analyzeComplexity, calculateComplexity, COMPLEXITY_THRESHOLD } = require('../../src/analyzer/complexity');

describe('Cyclomatic Complexity Analyzer', () => {
  describe('calculateComplexity', () => {
    it('should return 1 for simple function with no decisions', () => {
      const code = `function simple() { return 1; }`;
      expect(calculateComplexity(code)).toBe(1);
    });
    
    it('should count if statements', () => {
      const code = `function test(x) { if (x) {} if (y) {} }`;
      expect(calculateComplexity(code)).toBe(3); // 1 base + 2 ifs
    });
    
    it('should count for loops', () => {
      const code = `function test() { for (let i = 0; i < 10; i++) {} }`;
      expect(calculateComplexity(code)).toBe(2); // 1 base + 1 for
    });
    
    it('should count while loops', () => {
      const code = `function test() { while (true) {} }`;
      expect(calculateComplexity(code)).toBe(2); // 1 base + 1 while
    });
    
    it('should count switch cases', () => {
      const code = `function test(x) { switch(x) { case 1: break; case 2: break; } }`;
      expect(calculateComplexity(code)).toBe(3); // 1 base + 2 cases
    });
    
    it('should count logical operators', () => {
      const code = `function test(a, b, c) { if (a && b || c) {} }`;
      expect(calculateComplexity(code)).toBe(4); // 1 base + 1 if + 2 operators
    });
    
    it('should count ternary operators', () => {
      const code = `function test(x) { return x ? 1 : 0; }`;
      expect(calculateComplexity(code)).toBe(2); // 1 base + 1 ternary
    });
    
    it('should handle nested conditions', () => {
      const code = `function test(x, y) { if (x) { if (y) {} } }`;
      expect(calculateComplexity(code)).toBe(3); // 1 base + 2 ifs
    });
    
    it('should not count catch blocks as complexity', () => {
      const code = `function test() { try { risky(); } catch(e) { handle(); } }`;
      expect(calculateComplexity(code)).toBe(1); // 1 base, catch doesn't add
    });
  });
  
  describe('analyzeComplexity', () => {
    it('should return score of 100 for empty code', () => {
      const result = analyzeComplexity('');
      expect(result.score).toBe(100);
    });
    
    it('should identify high complexity functions', () => {
      const code = `
        function complex(a, b, c, d, e) {
          if (a) {
            if (b) {
              if (c) {
                if (d) {
                  if (e) {
                    for (let i = 0; i < 10; i++) {
                      if (i % 2 === 0) {}
                    }
                  }
                }
              }
            }
          }
          return a && b && c && d;
        }
      `;
      const result = analyzeComplexity(code);
      expect(result.highComplexityFunctions.length).toBeGreaterThan(0);
    });
    
    it('should calculate average complexity', () => {
      const code = `
        function simple() { return 1; }
        function medium(x) { if (x) {} return x; }
      `;
      const result = analyzeComplexity(code);
      expect(result.averageComplexity).toBe(1.5);
    });
    
    it('should count functions correctly', () => {
      const code = `
        function first() {}
        function second() {}
        function third() {}
      `;
      const result = analyzeComplexity(code);
      expect(result.functionCount).toBe(3);
    });
    
    it('should analyze arrow functions', () => {
      const code = `const test = (x) => { if (x) { return x; } return null; }`;
      const result = analyzeComplexity(code);
      expect(result.functionCount).toBe(1);
    });
    
    it('should analyze async functions', () => {
      const code = `async function fetchData() { if (true) {} return await fetch(); }`;
      const result = analyzeComplexity(code);
      expect(result.functionCount).toBe(1);
    });
  });
});
