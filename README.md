# Patch Pulse CLI

Check for outdated npm dependencies in your `package.json` file.

![License](https://img.shields.io/github/license/PatchPulse/cli.svg) [![npm Version](https://img.shields.io/npm/v/patch-pulse.svg)](https://npmjs.com/package/patch-pulse) [![npm Downloads](https://img.shields.io/npm/dm/patch-pulse.svg)](https://npmjs.com/package/patch-pulse) [![Test Coverage](https://img.shields.io/codecov/c/github/PatchPulse/cli)](https://codecov.io/gh/PatchPulse/cli) [![CI/CD](https://github.com/PatchPulse/cli/actions/workflows/ci.yml/badge.svg)](https://github.com/PatchPulse/cli/actions/workflows/ci.yml)
![GitHub stars](https://img.shields.io/github/stars/PatchPulse/cli.svg?style=social)

![Patch Pulse Banner](assets/banner.png)

## Quick Start

```bash
npx patch-pulse
```

That's it! Patch Pulse scans your `package.json` and shows which dependencies are outdated.

## Usage

```bash
# Check all dependencies
npx patch-pulse

# Show help
npx patch-pulse --help

# Show version
npx patch-pulse --version
```

**Checks:** dependencies, devDependencies, peerDependencies, optionalDependencies

## Example

![Example Screenshot](assets/example.png)

## Ecosystem

- **🔧 CLI Tool** (this repo) - Check dependencies from terminal
- **⚡ VSCode Extension** ([@PatchPulse/vscode-extension](https://github.com/PatchPulse/vscode-extension)) - Get updates in your editor _(Coming soon)_
- **🤖 Slack Bot** ([Add to Workspace](https://slack.com/oauth/v2/authorize?client_id=180374136631.6017466448468&scope=chat:write,commands,incoming-webhook)) - Get notified in Slack

## Troubleshooting

**"No dependencies found"** - Run from directory with `package.json`
**"Error reading package.json"** - Check JSON syntax and file permissions
**Network errors** - Verify internet connection and npm registry access

## Contributing

1. Fork and clone
2. `npm install`
3. Make changes
4. Submit PR

**Guidelines:** Add tests, update docs, keep commits atomic.

## Support

- ⭐ **Star** the repo
- 🐛 **Report bugs** via [Issues](https://github.com/PatchPulse/cli/issues)
- 💬 **Join discussions** in [Discussions](https://github.com/PatchPulse/cli/discussions)

## License

MIT - see [LICENSE](LICENSE)

## Author

[@BarryMichaelDoyle](https://github.com/barrymichaeldoyle)

**🎥 Live Development:** Sometimes I stream on [Twitch](https://twitch.tv/barrymichaeldoyle) - drop by and say hello!

---

**Made with ❤️ for the Node.js community**
