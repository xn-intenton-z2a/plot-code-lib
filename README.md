# repository0-plot-code-lib

repository0-plot-code-lib is a versatile CLI tool designed to plot and analyze mathematical functions. Built to be the "jq of formulae visualisations," it offers a rich set of plotting options and output formats while aligning with our core mission and updated CONTRIBUTING guidelines.

## Overview

- **Mathematical Plotting:** Generate plots for functions including sine, cosine, exponential, logarithmic, quadratic, linear, tangent, and many more. Advanced visualizations include scatter plots, bar charts, Lissajous curves, spiral, circular and custom plots.

- **Multiple Output Formats:** Export plots in CSV, Markdown, JSON, HTML, ASCII, SVG, XML, LaTeX, TXT, and R formats. (PNG output is provided as a stub.)

- **Interactive and Server Modes:** Enjoy interactive CLI input or run a lightweight Express server for a live demonstration of the plotting capabilities.

- **Extended Function Library:** Includes real implementations for derivative calculation, range generation, and various plotting features, while retaining legacy stubs for backward compatibility.

- **New Features:**
  - **Fibonacci Spiral, Combined Sin-Cos Plotting**
  - **Circular Plotting (--plot-circle)**
  - **Advanced Visualizations:** Polar Rose (--plot-polarrose), Star Polygon (--plot-starpolygon), Lemniscate (--lemniscate) plotting functions.
  - **Bessel Plotting:** New Bessel plotting function (--plot-bessel) using the Bessel function of the first kind.

- **Improved Test Coverage:** Enhanced mocks and test structure now bring test coverage near 100%.

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
  Explore plots using flags like `--plot-fibonacci`, `--plot-sincos`, `--heatmap`, `--plot-spiral`, `--plot-circle`, `--plot-polarrose`, `--plot-starpolygon`, `--lemniscate`, and now `--plot-bessel`.

- **Debug Mode:**
  ```bash
  node src/lib/main.js --debug
  ```

- **Custom Plot Parameters:**
  Pass parameters directly as command-line arguments.

## Changelog

- **0.7.80 (Latest):**
  - Extended functionalities with new spiral, circular, and custom plotting features.
  - Added Fibonacci spiral plotting and combined sine-cosine plotting (--plot-sincos).
  - Introduced new circular plotting with flag --plot-circle.
  - **New:** Added Polar Rose (--plot-polarrose), Star Polygon (--plot-starpolygon), Lemniscate (--lemniscate) and Bessel (--plot-bessel) plotting functions.
  - Pruned legacy drift to align with the mission statement.
  - **TEST:** Improved test coverage by adding beforeEach hooks and exporting a resetOverrides utility.
  - **REFRESH:** Updated README to reflect changes and the updated CONTRIBUTING guidelines.

## Contributing

We welcome contributions! Follow these steps:

1. **Open an Issue:**
   Provide a description of your idea, bug report, or improvement by opening an issue in our repository.

2. **Review Guidelines:**
   See [CONTRIBUTING.md](./CONTRIBUTING.md) for details of our contribution process.

3. **Submit a Pull Request:**
   Ensure your changes include clear commit messages and sufficient test coverage. Adhere to our automated workflow standards.

Your contributions help drive repository0-plot-code-lib towards being the definitive CLI plotting tool.

## License

MIT
