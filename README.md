# Patch Pulse CLI

Patch Pulse is a CLI tool that identifies out-of-date dependencies in your `package.json` file, ensuring your project stays up-to-date with the latest versions available on npm.

![License](https://img.shields.io/github/license/PatchPulse/cli.svg) [![npm Version](https://img.shields.io/npm/v/patch-pulse.svg)](https://npmjs.com/package/patch-pulse) [![npm Downloads](https://img.shields.io/npm/dm/patch-pulse.svg)](https://npmjs.com/package/patch-pulse)
![GitHub stars](https://img.shields.io/github/stars/PatchPulse/cli.svg?style=social) ![GitHub forks](https://img.shields.io/github/forks/PatchPulse/cli.svg?style=social)

![Patch Pulse Banner](assets/banner.png)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Example](#example)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Slack Bot](#slack-bot)
- [Support](#support)
- [License](#license)
- [Author](#author)

## Features

- **Easy to Use:** Run a single command to check all dependencies
- **Comprehensive:** Checks dependencies, devDependencies, peerDependencies, optionalDependencies, and bundledDependencies
- **Up-to-Date:** Compares against the latest versions on npm
- **Zero Configuration:** Works out of the box with any Node.js project
- **Colorful Output:** Beautiful terminal output with clear dependency status
- **Auto-Update Check:** Automatically checks for CLI updates

## Installation

No installation required! Just ensure you have [Node.js](https://nodejs.org) installed to use npx.

## Quick Start

Navigate to your project's root directory and run:

```bash
npx patch-pulse@latest
```

That's it! Patch Pulse will scan your `package.json` and show you which dependencies are out of date.

## Usage

### Basic Usage

```bash
# Check all dependencies in current directory
npx patch-pulse@latest

# Show help information
npx patch-pulse@latest --help

# Show version information
npx patch-pulse@latest --version
```

### What Gets Checked

Patch Pulse automatically checks all dependency types in your `package.json`:

- **dependencies** - Production dependencies
- **devDependencies** - Development dependencies
- **peerDependencies** - Peer dependencies
- **optionalDependencies** - Optional dependencies
- **bundledDependencies** - Bundled dependencies

### Output Format

The tool provides a clear summary showing:

- Current version vs latest available version
- Dependency type (dependencies, devDependencies, etc.)
- Visual indicators for update status

## Example

This is a screenshot from the v1 output. We plan on updating this soon.

![Example Screenshot](assets/example.png)

## Troubleshooting

### Common Issues

**"No dependencies found to check"**

- Make sure you're running the command from a directory containing a `package.json` file
- Verify your `package.json` has dependencies defined

**"Error reading package.json"**

- Ensure your `package.json` is valid JSON
- Check file permissions

**Network errors**

- Verify your internet connection
- Check if npm registry is accessible

### Getting Help

If you encounter issues:

1. Check this troubleshooting section
2. Open an issue on [GitHub](https://github.com/PatchPulse/cli/issues)
3. Ensure you're using the latest version: `npx patch-pulse@latest --version`

## Contributing

We welcome contributions! Here's how you can help:

### Development Setup

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/cli.git`
3. Install dependencies: `npm install`
4. Make your changes
5. Submit a pull request

### Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Keep commits atomic and well-described

## Slack Bot

Stay updated on npm package releases with our Slack Bot! Add it to your workspace:

[Add to Slack](https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook)

The Slack Bot will notify you when packages in your project receive updates.

## Support

### Ways to Support

- ⭐ **Star the repository** on GitHub
- 🐛 **Report bugs** and request features
- 💬 **Join discussions** in issues
- 📢 **Share** with your team and community

### Get Help

- 📖 **Documentation**: This README
- 🐛 **Issues**: [GitHub Issues](https://github.com/PatchPulse/cli/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/PatchPulse/cli/discussions)

## License

This project is licensed under MIT - see the [LICENSE](LICENSE) file for details.

## Author

This Patch Pulse CLI tool is maintained by [@BarryMichaelDoyle](https://github.com/barrymichaeldoyle).

---

**Made with ❤️ for the Node.js community**
