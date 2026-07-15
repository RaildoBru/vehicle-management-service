import { capitalizeFirstLetter } from '../src/utils/string.util.js';

describe('String Utils', () => {
  describe('capitalizeFirstLetter', () => {
    it('should capitalize the first letter of a simple word', () => {
      const result = capitalizeFirstLetter('hello');
      expect(result).toBe('Hello');
    });

    it('should capitalize first letter of each word in a phrase', () => {
      const result = capitalizeFirstLetter('hello world');
      expect(result).toBe('Hello World');
    });

    it('should handle strings with hyphens', () => {
      const result = capitalizeFirstLetter('hello-world');
      expect(result).toBe('Hello-World');
    });

    it('should handle multiple spaces between words', () => {
      const result = capitalizeFirstLetter('hello  world');
      expect(result).toBe('Hello  World');
    });

    it('should handle hyphens with multiple words', () => {
      const result = capitalizeFirstLetter('hello-world foo-bar');
      expect(result).toBe('Hello-World Foo-Bar');
    });

    it('should trim leading and trailing whitespace', () => {
      const result = capitalizeFirstLetter('  hello world  ');
      expect(result).toBe('Hello World');
    });

    it('should convert uppercase letters to lowercase first', () => {
      const result = capitalizeFirstLetter('HELLO WORLD');
      expect(result).toBe('Hello World');
    });

    it('should handle mixed case input', () => {
      const result = capitalizeFirstLetter('HeLoO WoRlD');
      expect(result).toBe('Heloo World');
    });

    it('should return empty string for empty input', () => {
      const result = capitalizeFirstLetter('');
      expect(result).toBe('');
    });

    it('should return null for null input', () => {
      const result = capitalizeFirstLetter(null);
      expect(result).toBeNull();
    });

    it('should return undefined for undefined input', () => {
      const result = capitalizeFirstLetter(undefined);
      expect(result).toBeUndefined();
    });

    it('should return string with single letter', () => {
      const result = capitalizeFirstLetter('a');
      expect(result).toBe('A');
    });

    it('should handle strings with only spaces', () => {
      const result = capitalizeFirstLetter('   ');
      expect(result).toBe('');
    });

    it('should handle strings with only hyphens', () => {
      const result = capitalizeFirstLetter('-');
      expect(result).toBe('-');
    });

    it('should handle complex hyphenated words', () => {
      const result = capitalizeFirstLetter('mother-in-law');
      expect(result).toBe('Mother-In-Law');
    });

    it('should handle multiple consecutive hyphens', () => {
      const result = capitalizeFirstLetter('hello--world');
      expect(result).toBe('Hello--World');
    });

    it('should capitalize numbers in strings', () => {
      const result = capitalizeFirstLetter('hello 123 world');
      expect(result).toBe('Hello 123 World');
    });

    it('should handle strings starting with numbers', () => {
      const result = capitalizeFirstLetter('123 hello');
      expect(result).toBe('123 Hello');
    });

    it('should return a string type', () => {
      const result = capitalizeFirstLetter('hello');
      expect(typeof result).toBe('string');
    });

    it('should handle tabs and special whitespace', () => {
      const result = capitalizeFirstLetter('hello\tworld');
      expect(result).toBe('Hello\tworld');
    });

    it('should handle single hyphenated word', () => {
      const result = capitalizeFirstLetter('hello-world-foo');
      expect(result).toBe('Hello-World-Foo');
    });

    it('should preserve original input for falsy values', () => {
      expect(capitalizeFirstLetter(false)).toBe(false);
      expect(capitalizeFirstLetter(0)).toBe(0);
    });

    it('should handle string with special characters', () => {
      const result = capitalizeFirstLetter('hello@world');
      expect(result).toBe('Hello@world');
    });

    it('should handle words with accents', () => {
      const result = capitalizeFirstLetter('café');
      expect(result).toBe('Café');
    });

    it('should be idempotent when called multiple times', () => {
      const input = 'hello world';
      const result1 = capitalizeFirstLetter(input);
      const result2 = capitalizeFirstLetter(result1);
      expect(result1).toBe(result2);
    });
  });
});
