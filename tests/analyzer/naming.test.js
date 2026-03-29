const { analyzeNaming, isCamelCase, isPascalCase } = require('../../src/analyzer/naming');

describe('Naming Convention Analyzer', () => {
  describe('isCamelCase', () => {
    it('should return true for valid camelCase', () => {
      expect(isCamelCase('myVariable')).toBe(true);
      expect(isCamelCase('getUserName')).toBe(true);
      expect(isCamelCase('a')).toBe(true);
    });
    
    it('should return false for non-camelCase', () => {
      expect(isCamelCase('MyVariable')).toBe(false);
      expect(isCamelCase('my_variable')).toBe(false);
      expect(isCamelCase('my-variable')).toBe(false);
      expect(isCamelCase('MYVARIABLE')).toBe(false);
    });
  });
  
  describe('isPascalCase', () => {
    it('should return true for valid PascalCase', () => {
      expect(isPascalCase('MyClass')).toBe(true);
      expect(isPascalCase('UserService')).toBe(true);
      expect(isPascalCase('A')).toBe(true);
    });
    
    it('should return false for non-PascalCase', () => {
      expect(isPascalCase('myClass')).toBe(false);
      expect(isPascalCase('my_class')).toBe(false);
      expect(isPascalCase('MYCLASS')).toBe(false);
    });
  });
  
  describe('analyzeNaming', () => {
    it('should return score of 100 for well-named code', () => {
      const code = `
        const userName = 'John';
        function getUserName() { return userName; }
        class UserService { constructor() {} }
      `;
      const result = analyzeNaming(code);
      expect(result.score).toBe(100);
    });
    
    it('should detect non-camelCase variables', () => {
      const code = `const user_name = 'John';`;
      const result = analyzeNaming(code);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0].type).toBe('variable');
    });
    
    it('should detect non-PascalCase classes', () => {
      const code = `class userService {}`;
      const result = analyzeNaming(code);
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0].type).toBe('class');
    });
    
    it('should not flag constants with UPPER_SNAKE_CASE', () => {
      const code = `const MAX_COUNT = 100;`;
      const result = analyzeNaming(code);
      expect(result.issues.length).toBe(0);
    });
    
    it('should flag short variable names (except exceptions)', () => {
      const code = `const x = 5; const ab = 10;`;
      const result = analyzeNaming(code);
      const shortNameIssues = result.issues.filter(i => i.message.includes('too short'));
      expect(shortNameIssues.length).toBe(2);
    });
    
    it('should allow common short names', () => {
      const code = `for (let i = 0; i < 10; i++) { const x = arr[i]; }`;
      const result = analyzeNaming(code);
      const shortNameIssues = result.issues.filter(i => i.message.includes('too short'));
      expect(shortNameIssues.length).toBe(0);
    });
    
    it('should suggest verb prefixes for functions', () => {
      const code = `function username() {}`;
      const result = analyzeNaming(code);
      const verbIssues = result.issues.filter(i => i.message.includes('verb'));
      expect(verbIssues.length).toBeGreaterThan(0);
    });
    
    it('should accept functions with verb prefixes', () => {
      const code = `function getUsername() {}`;
      const result = analyzeNaming(code);
      const verbIssues = result.issues.filter(i => i.message.includes('verb'));
      expect(verbIssues.length).toBe(0);
    });
    
    it('should return correct conventions object', () => {
      const result = analyzeNaming('');
      expect(result.conventions.variables).toBe('camelCase');
      expect(result.conventions.functions).toBe('camelCase');
      expect(result.conventions.classes).toBe('PascalCase');
      expect(result.conventions.constants).toBe('UPPER_SNAKE_CASE');
    });
  });
});
