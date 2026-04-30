# Code Quality Analyzer

[![CI](https://github.com/abdomohamed911/code-quality-analyzer/actions/workflows/ci.yml/badge.svg)](https://github.com/abdomohamed911/code-quality-analyzer/actions/workflows/ci.yml)

A CLI tool for static JavaScript code analysis that evaluates complexity, naming conventions, error handling patterns, and documentation coverage. Provides actionable feedback with scored reports to help developers write cleaner, more maintainable code.

## Overview

Code Quality Analyzer scans JavaScript source files and produces a quality report covering four key areas: cyclomatic complexity, naming convention adherence, error handling patterns, and JSDoc documentation coverage. Each area receives an individual score, and a weighted overall score is calculated. The tool outputs results in text, JSON, or Markdown format, making it suitable for both interactive use and CI pipeline integration.

## Features

- **Cyclomatic Complexity Analysis** — Identifies high-complexity functions exceeding configurable thresholds using decision-point counting (if, for, while, switch, ternary, logical operators)
- **Naming Convention Checks** — Validates camelCase variables/functions, PascalCase classes, UPPER_SNAKE_CASE constants, and descriptive naming (minimum 3 characters)
- **Error Handling Detection** — Scans for async functions without try-catch, empty catch blocks, and unused error variables
- **Documentation Coverage** — Measures JSDoc coverage percentage across functions and classes
- **Weighted Scoring** — Combines all four analysis areas into a single quality score (0-100)
- **Multiple Output Formats** — Text (terminal), JSON (machine-readable), and Markdown (reports)
- **Code Examples** — Includes before/after code samples and manual review notes for common issues

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 18+ |
| CLI Framework | Commander.js |
| AST Parser | Acorn (available for future enhancements) |
| Analysis | Custom regex-based analyzers |
| Security | Helmet, CORS, express-rate-limit |
| Testing | Jest, Supertest (78 tests, 6 suites) |
| Linting | ESLint |
| CI/CD | GitHub Actions |
| Containerization | Docker (multi-stage build) |

## Architecture

```
code-quality-analyzer/
  src/
    analyzer/            # Core analysis modules
      index.js           # Orchestrator — analyzeCode() with weighted scoring
      complexity.js      # Cyclomatic complexity via decision-point counting
      naming.js          # Convention checks (camelCase, PascalCase, UPPER_SNAKE)
      errorHandling.js   # Try-catch, async, empty catch detection
      documentation.js   # JSDoc coverage measurement
    controllers/         # API request handlers
    middleware/          # Validation, error handling
    models/              # Data models
    routes/              # Express route definitions
    services/            # Business logic
    utils/               # Pagination, API errors, file parsing, report generation
    app.js               # Express app setup
    index.js             # CLI entry point (commander)
  tests/
    analyzer/            # Analyzer unit tests (34 tests)
    unit/                # Service/utility tests (24 tests)
    integration/         # API integration tests (12 tests)
  before/                # Bad code examples
  after/                 # Fixed code examples
  examples/              # Additional sample code
  review-notes/          # Manual review writeups
  .github/workflows/     # CI pipeline
  Dockerfile             # Production container
```

## Quick Start

### Prerequisites

- Node.js 18+

### Install & Run

```bash
git clone https://github.com/abdomohamed911/code-quality-analyzer.git
cd code-quality-analyzer
npm install

# Analyze a file
node src/index.js analyze path/to/file.js

# Analyze a directory
node src/index.js analyze src/
```

### Run Tests

```bash
# All tests with coverage
npm test

# Analyzer tests only
npx jest tests/analyzer/ --verbose
```

### Docker

```bash
docker build -t code-quality-analyzer .
docker run -v $(pwd):/app code-quality-analyzer analyze /app/src/
```

## Results

| Metric | Value |
|---|---|
| Total tests | 78 (6 suites) |
| Analyzer tests | 34 (complexity, naming, error handling) |
| Unit tests | 24 (service, pagination) |
| Integration tests | 12 (all API endpoints) |
| Analysis categories | 4 (complexity, naming, error handling, documentation) |
| Output formats | 3 (text, JSON, Markdown) |

## What I Learned

1. **Regex-based analysis is fragile but educational**: Building analyzers with regex instead of a proper AST parser taught me why tools like ESLint use ASTs. Patterns like nested template literals, destructured imports, and optional chaining all break regex-based detection. Adding Acorn as a dependency was the right call — it provides the foundation for a more robust v2.

2. **Test data design matters as much as the code**: The before/after code examples and the test fixtures needed to be carefully constructed to cover edge cases. A single missing parenthesis in a test fixture can cause cascading false positives. Writing the "good code" examples (in `after/`) forced me to articulate exactly what clean code looks like, which improved the analyzer rules.

3. **Weighted scoring is subjective but necessary**: Combining four different analysis dimensions into a single score required choosing weights that reflect real-world priorities. Naming and documentation issues are common but low-severity, while high complexity is a stronger signal. The weighting system (severity-based penalty scoring) balances these tradeoffs and produces scores that correlate with actual code review feedback.

## License

MIT

---

**Abdelrahman Mohamed** | [GitHub](https://github.com/abdomohamed911)
