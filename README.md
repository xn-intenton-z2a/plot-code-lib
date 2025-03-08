# repository0-plot-code-lib

A powerful CLI tool for accurate mathematical plotting, aligned with our mission:

"Be a go-to plot library with a CLI, be the jq of formulae visualisations."

## Overview

repository0-plot-code-lib is a versatile command-line utility designed for plotting and analyzing mathematical functions with precision. The tool supports a wide variety of output formats and interactive modes. The CLI now supports multiple flags to output different plot types as well as diagnostics and interactive modes.

## Features

- **Mathematical Plots:** Includes quadratic, linear, sine, cosine, exponential, logarithmic, and many other advanced plots.
- **Extended Functions:** Supports export in CSV, Markdown, JSON, HTML, ASCII, SVG, XML, LaTeX, TXT, and R formats.
- **CLI Modes:** Diagnostics, interactive mode, web server mode, debug mode, and a range of export/plot flags.

## Installation

Ensure Node.js (v20 or higher) is installed. Then install via npm:

```bash
npm install @xn-intenton-z2a/repository0-plot-code-lib
```

## Usage

Run the default demo:

```bash
npm run start
```

Other available modes include:

- **Diagnostics:** `npm run diagnostics` will display the Node version.
- **Interactive Mode:** `node src/lib/main.js --interactive` to input commands interactively. (In test environments the prompt resolves immediately.)
- **Web Server Mode:** `node src/lib/main.js --serve` starts an Express server on port 3000. (In test environments, the server simulation avoids actual port binding.)
- **Plot/Export Flags:**
  - `--plot-abs`: Outputs an absolute plot of sin(x).
  - `--export-csv`: Outputs CSV formatted plot data.
  - `--export-md`: Outputs Markdown table format.
  - `--export-json`: Outputs JSON data.
  - `--export-html`: Outputs HTML table. *(Note: HTML, ASCII, SVG, and XML outputs are concatenated into a single string for consistency.)*
  - `--export-ascii`: Outputs ASCII formatted table.
  - `--export-svg`: Outputs SVG content.
  - `--export-xml`: Outputs XML data.
  - `--export-latex`: Outputs LaTeX table.
  - `--export-txt`: Outputs plain text.
  - `--export-r`: Outputs R-friendly format.
  - `--scatter`, `--bar-chart`, `--plot-parametric`, `--plot-poly`, `--lissajous`, `--lemniscate`, `--power-plot`: Output various plot types as demo data.
- **Debug Mode:** `node src/lib/main.js --debug` lists all available plotting functions.
- **Unrecognized flags:** Any unrecognized flag will be treated as plot parameters.

For detailed contribution guidelines, see [CONTRIBUTING.md](./CONTRIBUTING.md).

## Changelog

- **2023-10:** Refactored CLI to support dynamic importing of module loaders in interactive and server modes to improve testability and adhere to the mission statement.
- **2023-10:** Updated interactive mode to ensure proper resolution of user input and fixed error handling in both interactive and server modes.

## License

MIT
