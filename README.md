# repository0-plot-code-lib

**A versatile plotting tool for mathematical visualizations aligned with our mission.**

> "Be a go-to plot library with a CLI, be the jq of formulae visualisations."

## Overview

repository0-plot-code-lib is a CLI tool engineered for high precision plotting and analysis of mathematical functions. Built to strictly adhere to our mission statement and the guidelines outlined in CONTRIBUTING.md, it provides a comprehensive suite of plotting functions, statistical analysis tools, and versatile output formats. The library is optimized for both demo usage and interactive real-world applications.

## Features

- **Plotting Functions:**
  - Supports Quadratic, Linear, Sine, Cosine, Tangent, Exponential, Logarithmic, Square Root, and Polar plots
  - Absolute value plotting, derivative plotting, logistic and cubic plots
  - Custom range generation using an in-house range generator

- **Statistical and Transformation Tools:**
  - Standard deviation and Pearson correlation calculations
  - Data smoothing (moving average and exponential moving average)
  - Point transformations such as rotation, reflection, scaling, and offset adjustments

- **CLI Modes:**
  - Default demo mode presenting a brief introduction
  - Diagnostics mode (`--diagnostics`)
  - Interactive mode (`--interactive`) with input prompt and built-in fallback timeout
  - Web server mode (`--serve`) with enhanced security configurations
  - CSV Export mode (`--export-csv`) for sample data export
  - Markdown Export mode (`--export-md`) for exporting plot data as a Markdown table
  - Debug mode (`--debug`) for listing available plotting functions

## Installation

Ensure you have Node.js (v20 or higher) installed. Then install the package via npm:

```bash
npm install @xn-intenton-z2a/repository0-plot-code-lib
```

## Usage

### CLI Quickstart

Run the default demo:

```bash
npm run start
```

Other modes include:

- **Diagnostics Mode:**
  ```bash
  npm run diagnostics
  ```

- **Interactive Mode:**
  ```bash
  node src/lib/main.js --interactive
  ```
  You will be prompted for a plot command; a fallback timeout is triggered if no input is given.

- **Web Server Mode:**
  ```bash
  node src/lib/main.js --serve
  ```
  This starts an Express-based interactive plotting interface.

- **Absolute Plot Demo Mode:**
  ```bash
  node src/lib/main.js --plot-abs
  ```

- **CSV Export Mode:**
  ```bash
  node src/lib/main.js --export-csv
  ```
  Outputs sample plot data in CSV format.

- **Markdown Export Mode:**
  ```bash
  node src/lib/main.js --export-md
  ```
  Exports sample plot data as a Markdown table.

- **Debug Mode:**
  ```bash
  node src/lib/main.js --debug
  ```
  Displays a list of available plotting functions.

## Default Demo

Running the CLI with no arguments displays a demo message that introduces the tool and its capabilities.

## Changelog Highlights

- Refined CLI messages and functionalities to maintain strict alignment with our mission statement.
- Removed legacy and extraneous code to focus on core plotting functionalities per updated CONTRIBUTING guidelines.
- Extended the library with new features: plotSqrt, plotPolar, plotAbsolute, generateRange, plotDerivative, offsetPoints, plotLogistic, plotCubic, and calculateStandardDeviation.
- Added new helper functions: calculateCorrelation, plotHyperbolic, calculateExponentialMovingAverage, plotGaussian, exportPlotAsCSV, and exportPlotAsMarkdown.
- Introduced CSV export mode (`--export-csv`), Markdown export mode (`--export-md`), and Debug mode (`--debug`).
- **Improved test coverage and enhanced error handling**, including support for single-layer mocks and deep external resource mocks.

## Contributing

Contributions are automated. To contribute:

1. Open an issue describing your idea, bug, or improvement.
2. Label the issue as `automated` to trigger our workflow.
3. Follow the guidelines detailed in [CONTRIBUTING.md](./CONTRIBUTING.md).

We welcome enhancements that align with our mission: to be the leading CLI plotting tool that seamlessly integrates mathematical precision with flexible output formats.

## License

MIT
