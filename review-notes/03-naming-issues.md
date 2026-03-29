# Code Review: Naming Conventions

## Issues Identified

### Critical
1. **Single-letter variable names** - `p`, `d`, `t`, `x`, `a`, `b` provide no context
2. **Non-descriptive function names** - `p`, `g`, `fn`, `proc` don't indicate purpose

### Medium
3. **Unclear class name** - `u` doesn't describe what the class does
4. **Magic status values** - `s === 1`, `t === 'a'` without context
5. **Abbreviated state names** - `'i'`, `'l'`, `'s'`, `'e'` instead of full words

### Low
6. **Missing verb in function name** - `fn` should be something like `getMaxValue`
7. **Reinventing built-ins** - `proc` duplicates `Array.filter()`

## Improvements Made

1. **Descriptive function names**
   - `p` → `processDataByType`
   - `g` → `fetchData`
   - `fn` → `getMaxValue`
   - `proc` → `filterItems`

2. **Descriptive variable names**
   - `d` → `dataItems`
   - `t` → `calculationType`
   - `x` → `item`

3. **Descriptive class name**
   - `u` → `DataFetcher`

4. **Named constants for states**
   - `'i'` → `'idle'`
   - `'l'` → `'loading'`
   - `'s'` → `'success'`
   - `'e'` → `'error'`

5. **Replaced magic values**
   - `s === 1` → `status === 'active'`
   - `t === 'a'` → `calculationType === 'active'`

## Naming Best Practices

1. Use **camelCase** for variables and functions
2. Use **PascalCase** for classes
3. Use **descriptive names** that reveal intent
4. Avoid **abbreviations** unless universally understood (e.g., URL, ID)
5. Use **verbs** for function names (get, set, calculate, fetch, process)
6. Use **nouns** for variables and classes
7. **Booleans** should start with is/has/can/should