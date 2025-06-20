# Patch Pulse CLI - Source Code Structure

This directory contains the modular TypeScript source code for the Patch Pulse CLI tool.

## Directory Structure

```
src/
├── index.ts                    # Main CLI entry point
├── types.ts                    # TypeScript interfaces and types
├── core/                       # Core business logic
│   └── dependency-checker.ts   # Main dependency checking logic
├── services/                   # External service integrations
│   ├── npm.ts                  # NPM registry API interactions
│   └── package.ts              # Package.json file operations
└── utils/                      # Utility functions
    ├── ui.ts                   # UI/display formatting utilities
    └── version.ts              # Version parsing and comparison utilities
```

## Module Responsibilities

### `index.ts`

- CLI entry point and argument handling
- Orchestrates the main application flow
- Handles help and version commands

### `types.ts`

- Centralized TypeScript interfaces
- `PackageJson` - Structure of package.json files
- `DependencyInfo` - Information about package dependencies
- `NpmPackageInfo` - NPM registry API response structure
- `VersionInfo` - Parsed version information

### `core/dependency-checker.ts`

- Main business logic for checking dependency versions
- Displays dependency status and update information
- Handles progress indicators and result formatting

### `services/npm.ts`

- NPM registry API interactions
- Fetches latest package versions
- Checks for CLI updates

### `services/package.ts`

- Package.json file reading and parsing
- File system operations for package.json

### `utils/ui.ts`

- UI formatting and display functions
- Help and version command displays
- Colored output and box creation utilities

### `utils/version.ts`

- Version string parsing and comparison
- Update type detection (patch/minor/major)
- Version outdated checking logic

## Benefits of This Structure

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **Maintainability**: Easier to locate and modify specific functionality
3. **Testability**: Individual modules can be unit tested in isolation
4. **Reusability**: Utility functions can be reused across different parts of the application
5. **Scalability**: New features can be added without cluttering the main file
6. **Readability**: Smaller, focused files are easier to understand

## Adding New Features

When adding new features:

1. **New types**: Add to `types.ts`
2. **New utilities**: Add to appropriate `utils/` file or create new one
3. **New services**: Add to `services/` directory
4. **New core logic**: Add to `core/` directory
5. **CLI commands**: Handle in `index.ts`

This modular structure makes the codebase much more maintainable and easier to extend.
