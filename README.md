# repository0-plot-code-lib

**A versatile plotting tool for mathematical formula visualizations**

> _Be a go-to plot library with a CLI, be the jq of formulae visualisations._

---

## Overview

This library provides a command-line interface (CLI) and an integrated web interface for plotting a wide variety of mathematical functions including quadratic, linear, trigonometric (sine, cosine, tangent), polar, exponential, and logarithmic equations. The library generates multiple output formats, facilitating immediate use in workflows or web integration.

---

## Features

- **Plot Types:** Quadratic, Linear, Sine, Cosine, Tangent, Polar, Exponential, Logarithmic
- **Output Formats:** SVG, JSON, CSV, Markdown, ASCII, HTML
- **Advanced Analysis:**
  - Area under curve (Trapezoidal Rule)
  - Derivative calculation (Finite differences)
  - Statistical functions: average, standard deviation, median, mode
  - Transformations: Rotation, Reflection, Scaling, Inversion, Smoothing (Moving average)
  - Gradient visualization

---

## Installation

Requires Node.js (v20 or higher):

```bash
npm install @xn-intenton-z2a/repository0-plot-code-lib
```

## Usage

### CLI Quickstart

Generate a simple quadratic plot as SVG:

```bash
node src/lib/main.js output.svg "quad:1,0,0,-10,10,1"
```

### Enhanced CLI Features

- **Diagnostics Mode:**

  ```bash
  node src/lib/main.js --diagnostics
  ```
  Outputs Node.js diagnostics information.

- **Interactive Mode:**

  ```bash
  node src/lib/main.js --interactive
  ```
  Prompts the user for a plot command.

- **Web Interface Mode:**

  ```bash
  node src/lib/main.js --serve
  ```
  Starts an Express-based interactive plotting web interface.

### Default Demo

If no arguments are provided, the CLI displays a demo message:

```bash
node src/lib/main.js
```

### Examples

**Linear Plot (SVG):**

```bash
node src/lib/main.js linear.svg "linear:2,3,-10,10,1"
```

**Custom Mathematical Expression:**

```bash
node src/lib/main.js expression.svg "expr:Math.sin(x)*x:-10,10,0.5"
```

**ASCII Plot Output:**

```bash
node src/lib/main.js --ascii "sine:1,1,0,0,360,30"
```

---

## Detailed Source Code Overview

The core logic resides in `src/lib/main.js`, and now includes multiple execution paths:

- **Demo Output:** Shows a placeholder demo message when no arguments are passed.
- **Diagnostics:** With the `--diagnostics` flag, outputs diagnostic info.
- **Interactive CLI:** With the `--interactive` flag, prompts the user for plot commands.
- **Express Server:** With the `--serve` flag, starts a simple Express-based web interface.
- **Plot Request Processing:** Processes plot parameters in a simulated manner.

---

## Developer Guide

### Contributing

Contributions are fully automated. Open an issue with the label `automated` to trigger workflows. See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions.

### Running Tests

Execute tests with coverage reporting:

```bash
npm run test:unit
```

### Linting and Formatting

Check and fix code formatting and linting:

```bash
npm run formatting
npm run formatting-fix
npm run linting
```

---

## Changelog Highlights

- **0.5.0-1:**
  - Updated CLI implementation in `src/lib/main.js` to support `--diagnostics`, `--serve`, and `--interactive` options in line with the mission statement.

- **0.5.0-0:**
  - Previous version with basic CLI demo output and plotting simulation.

---

## License

MIT
