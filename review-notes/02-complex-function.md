# Code Review: Complex Function Refactoring

## Issues Identified

### Critical
1. **Cyclomatic complexity of ~20** - Far exceeds the recommended threshold of 10
2. **Deeply nested conditionals** - 4-5 levels of nesting makes code hard to follow
3. **Difficult to test** - Cannot test individual discount calculations in isolation

### Medium
4. **Repeated patterns** - Similar discount calculations repeated (checking thresholds)
5. **Magic numbers** - Discount values hardcoded throughout

### Low
6. **No documentation** - Complex logic lacks explanation
7. **No modular exports** - Cannot reuse individual calculation functions

## Improvements Made

1. **Decomposed into single-responsibility functions**
   - Each discount type has its own function
   - Maximum complexity per function: 3-4

2. **Improved testability**
   - Each sub-function can be tested independently
   - Clear inputs and outputs

3. **Added constants**
   - `MAX_DISCOUNT_PERCENT` extracted as named constant

4. **Used functional patterns**
   - `reduce()` for aggregations
   - Higher-order function for promotion filtering

5. **Added comprehensive JSDoc**
   - All functions documented with parameters and return types

## Complexity Comparison

| Function | Before | After |
|----------|--------|-------|
| calculateDiscount | ~20 | 1 |
| getUserBasedDiscounts | N/A | 1 |
| getMembershipDiscount | N/A | 3 |
| getQuantityDiscount | N/A | 3 |

## Key Learnings

- Functions should do one thing well
- Extract complex conditions into named functions
- Use constants instead of magic numbers
- Small functions are easier to test and understand
