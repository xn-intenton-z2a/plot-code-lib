# repository0-plot-code-lib

repository0-plot-code-lib is a versatile CLI tool designed to plot and analyze mathematical functions. Our mission is to "Be a go-to plot library with a CLI, be the jq of formulae visualisations." The tool supports a range of plotting functionalities including classic functions (sine, cosine, exponential, logarithmic, quadratic, linear, tangent) as well as advanced visualizations like heatmaps, scatter, bar charts, Lissajous, spiral plots, and custom plots.

## Overview

- **Mathematical Plotting:**
  Supports plotting of many functions including sine, cosine, quadratic, linear, and others.
- **Multiple Output Formats:**
  Outputs plots in CSV, Markdown, JSON, HTML, ASCII, SVG, XML, LaTeX, TXT, and R formats (PNG support remains a stub).
- **Interactive CLI:**
  Features interactive mode, diagnostics, a web server mode, and a debug flag for internal diagnostics.
- **Extended Function Library:**
  Provides real implementations for derivative calculations, range generation, various plotting functions, and new custom plotting functionality, while retaining legacy stubs for backward compatibility.

## Installation

**Prerequisites:** Node.js v20 or higher

Install via npm:

```bash
npm install @xn-intenton-z2a/repository0-plot-code-lib
```

## Usage

Run the default demo:

```bash
npm run start
```

Other available commands:

- **Diagnostics:**
  ```bash
  npm run diagnostics
  ```
- **Interactive Mode:**
  ```bash
  node src/lib/main.js --interactive
  ```
- **Web Server Mode:**
  ```bash
  node src/lib/main.js --serve
  ```
- **Plot/Export Flags:**
  Use flags such as `--plot-abs`, `--export-csv`, `--export-md`, etc., to generate specific plot outputs.
- **Advanced Visualizations:**
  Use flags like `--heatmap`, `--scatter`, `--bar-chart`, `--lissajous`, `--plot-spiral`, and the new `--plot-custom` for extended plotting features.
- **Debug Mode:**
  ```bash
  node src/lib/main.js --debug
  ```
- **Custom Plot Parameters:**
  Simply pass your plot parameters as command-line arguments.

## Changelog

- **2024-12.12:**
  - Refreshed README and documentation in line with CONTRIBUTING guidelines.
  - Pruned outdated and irrelevant content.
  - Updated descriptions to emphasize extended plotting features including spiral and custom plotting (--plot-custom flag).

## Contributing

We welcome contributions! To contribute:

1. **Open an Issue:**
   Describe your idea, bug, or improvement.
2. **Review Guidelines:**
   Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for our contribution process and workflow details.
3. **Submit a Pull Request:**
   Ensure your changes are accompanied by clear commit messages and adequate test coverage.

Thank you for helping improve repository0-plot-code-lib!

## License

MIT
