# repository0-plot-code-lib

**A versatile plotting tool for mathematical formula visualizations**

> _Be a go-to plot library with a CLI, be the jq of formulae visualisations._

---

## Overview

This library provides a command-line interface (CLI) and an integrated web interface for plotting a wide variety of mathematical functions. Its design adheres closely to our mission statement and contributing guidelines. The features include generating various output formats and performing advanced analyses such as area calculations, derivative estimations, and transformations.

## Features

- **Plot Types:** Quadratic, Linear, Sine, Cosine, Tangent, Polar, Exponential, Logarithmic
- **Output Formats:** SVG, JSON, CSV, Markdown, ASCII, HTML
- **Advanced Analysis:**
  - Area under curve (Trapezoidal Rule)
  - Derivative calculation (Finite differences)
  - Statistical functions: average, standard deviation, median, mode
  - Transformations: Rotation, Reflection, Scaling, Inversion, Smoothing (Moving average)
  - Gradient visualization
- **Additional Library Functions:**
  - plotQuadratic: Generates an array of points for a quadratic function.
  - calculateDerivative: Approximates the derivative of a function at a given point.
  - calculateArea: Approximates the area under a function curve using the trapezoidal rule.

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
  Outputs Node.js diagnostic information.

- **Interactive Mode:**

  ```bash
  node src/lib/main.js --interactive
  ```
  Prompts the user for a plot command. In non-interactive environments, a fallback timeout prevents hanging. (For tests, ensure the environment variable VITEST is set to "true".)

- **Web Interface Mode:**

  ```bash
  node src/lib/main.js --serve
  ```
  Starts an Express-based interactive plotting web interface. The server initialization now properly awaits asynchronous callbacks and safely handles server closure, ensuring reliable logging and test execution.

### Default Demo

If no arguments are provided, the CLI displays a demo message:

```bash
node src/lib/main.js
```

## Changelog Highlights

- **0.5.0-9:**
  - Fixed server initialization error in --serve mode by changing the server variable declaration to avoid premature reference issues.
  - Updated dynamic import patterns for loadExpress and loadReadline to support asynchronous operations and testing mocks.
  - Reinforced adherence to the mission statement by ensuring accurate demo outputs and extending helper functions.
  - Reflected all changes in tests and documentation per contributing guidelines.

## Contributing

Contributions are automated. Please open an issue and label it as `automated` to trigger our workflows. For additional details, see [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
