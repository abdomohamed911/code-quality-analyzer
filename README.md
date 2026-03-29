# Code Quality Analyzer

A command-line engineering tool that scans JavaScript and TypeScript codebases, identifies quality issues, and produces actionable reports with specific improvement recommendations. Designed for integration into CI/CD pipelines and local development workflows alike.

## Overview

Code Quality Analyzer shifts code review from a manual, opinion-driven process to an automated, data-driven one. It parses source files, evaluates them against a configurable ruleset covering complexity, readability, maintainability, and best practices, then outputs a structured report that developers can act on immediately.

The tool is built to be fast enough for incremental checks during development and thorough enough for full-repository analysis in automated pipelines. Reports are generated in both human-readable and machine-parseable formats, enabling integration with dashboards, git hooks, and pull request systems.

## Features

- **Multi-Language Support** -- Analyzes both JavaScript and TypeScript source files with language-aware parsing
- **Complexity Metrics** -- Calculates cyclomatic complexity, cognitive complexity, and nesting depth per function and per file
- **Readability Analysis** -- Evaluates naming conventions, function length, file structure, and code organization patterns
- **Maintainability Scoring** -- Produces a composite maintainability index based on complexity, duplication, and documentation coverage
- **Best Practice Rules** -- Configurable ruleset covering error handling patterns, async/await usage, TypeScript strictness, and module structure
- **Incremental Analysis** -- Supports scanning only changed files for fast feedback during development
- **Multiple Output Formats** -- Generates reports in console (colorized), JSON, and Markdown for different consumption contexts
- **Configurable Thresholds** -- Set acceptable limits for complexity, file length, and other metrics per project or per directory
- **CI/CD Integration** -- Returns non-zero exit codes when quality gates are not met, making it straightforward to gate deployments on code quality
- **Ignore Patterns** -- Respects `.gitignore` and supports additional exclusion patterns for vendor code, generated files, and test fixtures

## Tech Stack

| Category | Technology |
|---|---|
| Language | JavaScript, TypeScript |
| Runtime | Node.js |
| Parsing | Custom AST-based analysis |
| CLI | Native Node.js CLI with argument parsing |
| Output | Console, JSON, Markdown |
| Testing | Jest |

## Architecture

```
code-quality-analyzer/
  src/
    cli/                # Command-line interface and argument parsing
    analyzer/           # Core analysis engine
      parsers/          # AST parsers for JavaScript and TypeScript
      rules/            # Individual quality rules and detectors
      metrics/          # Complexity and maintainability calculators
      reporters/        # Output formatters (console, JSON, Markdown)
    config/             # Default configuration and schema
    utils/              # File system utilities, path resolution
  tests/                # Test suites for rules, parsers, and reporters
  output/               # Default output directory for generated reports
```

**Analysis Pipeline:**

1. The CLI resolves the target directory and applies ignore patterns
2. The file discovery layer collects all analyzable source files
3. Each file is parsed into an AST using language-appropriate parsers
4. Rules are applied to the AST, producing a list of findings
5. Metrics are calculated per-function and aggregated per-file
6. The reporter formats findings and metrics into the requested output format
7. Exit code is set based on whether configured thresholds are exceeded

## Configuration

Create a `.codequalityrc.json` file in your project root:

```json
{
  "target": "./src",
  "ignore": ["**/*.test.ts", "**/*.spec.js", "**/dist/**"],
  "thresholds": {
    "maxComplexity": 10,
    "maxFileLength": 300,
    "maxFunctionLength": 50,
    "minMaintainabilityIndex": 65
  },
  "rules": {
    "no-nested-ternaries": "error",
    "max-callbacks-depth": "warn",
    "require-error-handling": "error",
    "prefer-const-assertions": "warn"
  },
  "output": {
    "format": "console",
    "dir": "./output"
  }
}
```

## Usage

### Installation

```bash
git clone https://github.com/abdomohamed911/code-quality-analyzer.git
cd code-quality-analyzer
npm install
```

### Analyze a Project

```bash
# Analyze the current directory
npx code-quality-analyzer

# Analyze a specific path
npx code-quality-analyzer ./path/to/project

# Use a custom config file
npx code-quality-analyzer --config ./custom-config.json

# Output results as JSON
npx code-quality-analyzer --format json --output ./results.json
```

### CI/CD Integration

```bash
# Fail the build if quality thresholds are not met
npx code-quality-analyzer --ci --format json --output ./quality-report.json
```

The `--ci` flag enables strict mode: the process exits with code 1 if any threshold is exceeded, making it suitable for use in GitHub Actions, GitLab CI, or any pipeline that checks exit codes.

### Available Flags

| Flag | Description |
|---|---|
| `--config` | Path to a custom configuration file |
| `--format` | Output format: console, json, markdown |
| `--output` | File path for JSON or Markdown output |
| `--ci` | Enable strict mode with non-zero exit on threshold breach |
| `--ignore` | Additional ignore patterns (comma-separated) |
| `--verbose` | Include detailed rule explanations in the output |

## Report Structure

The analyzer produces reports organized by file, with each finding categorized by severity:

- **error** -- Issues that should be addressed before merging (complexity violations, missing error handling)
- **warn** -- Issues that degrade quality over time (long functions, deep nesting, inconsistent naming)
- **info** -- Suggestions for improvement (documentation gaps, refactoring opportunities)

Each finding includes the file path, line number, the applicable rule, and a specific recommendation for resolving the issue.

## License

MIT

---

**Abdelrahman Mohamed** | [GitHub](https://github.com/abdomohamed911)
