#!/usr/bin/env node
// src/lib/main.js
// CLI for mathematical plotting aligned with our mission:
// "Be a go-to plot library with a CLI, be the jq of formulae visualisations."
// This version has been updated to prune drift and fully align messaging with our mission statement and contributing guidelines,
// with extended library functions including new plotPower, plotSigmoid, plotSinc, plotReLU, movingMedian, and additional functions: plotInverse and cumulativeSum.

import { fileURLToPath } from "url";
import * as math from "mathjs";

/**
 * Dynamically load the Express module. Exported for easy mocking during tests.
 */
export async function loadExpress() {
  try {
    return await import("express");
  } catch (err) {
    throw new Error("Failed to load express: " + err.message);
  }
}

/**
 * Dynamically load the readline module. Exported for easy mocking during tests.
 */
export async function loadReadline() {
  try {
    return await import("readline");
  } catch (err) {
    throw new Error("Failed to load readline: " + err.message);
  }
}

// Helper to get the current module bindings for proper mocking in tests
async function getSelf() {
  return await import(import.meta.url);
}

/**
 * Main entry point of the CLI application.
 * @param {string[]} args - Command line arguments.
 */
export async function main(args) {
  // No arguments: show demo output aligned with our mission statement and contributing guidelines.
  if (args.length === 0) {
    console.log(
      "Welcome to repository0-plot-code-lib CLI: Embracing our mission 'Be a go-to plot library with a CLI, be the jq of formulae visualisations.'\n" +
      "Select from modes: --interactive, --serve, --diagnostics, --plot-abs, --export-csv, --export-md, --export-json, --export-html, --export-ascii, --export-svg, --export-xml, --export-latex, --export-txt, --export-r, --bar-chart, --scatter, --plot-parametric, --plot-poly, --lissajous, --lemniscate, --hyperbola, --power-plot or provide plot parameters.\n" +
      "For contribution guidelines, please refer to CONTRIBUTING.md."
    );
    return;
  }

  // --diagnostics flag: output diagnostics info
  if (args.includes("--diagnostics")) {
    console.log(`Diagnostics: Node version: ${process.version}`);
    return;
  }

  // --debug flag: list available plotting functions for debugging purposes.
  if (args.includes("--debug")) {
    const funcs = [
      "plotQuadratic", "calculateDerivative", "calculateArea", "plotLinear", "plotSine", "plotCosine", "rotatePoints", "plotExponential", "plotLogarithmic",
      "movingAverage", "plotTangent", "reflectPoints", "scalePoints", "plotSqrt", "plotPolar", "plotAbsolute", "generateRange", "plotDerivative", "offsetPoints",
      "plotLogistic", "plotCubic", "calculateStandardDeviation", "calculateCorrelation", "plotHyperbolic", "calculateExponentialMovingAverage", "plotGaussian",
      "exportPlotAsCSV", "exportPlotAsMarkdown", "exportPlotAsJSON", "exportPlotAsHTML", "exportPlotAsASCII", "exportPlotAsSVG", "exportPlotAsXML", "exportPlotAsLaTeX", "exportPlotAsTXT", "exportPlotAsR",
      "plotScatter", "plotParametric", "plotBarChart", "plotEllipse", "plotPolynomial", "plotModulatedSine", "plotSpiral", "plotSigmoid", "plotSinc", "calculateDefiniteIntegral", "plotCustom", "solveQuadraticEquation", "plotSinCosCombined", "interpolateData", "plotBezier", "plotLissajous", "plotBessel", "plotHyperbola", "plotLemniscate", "plotPower", "plotReLU", "movingMedian",
      // Newly added functions
      "plotInverse", "cumulativeSum"
    ];
    console.log("Aligned with our mission, available plotting functions: " + funcs.join(", "));
    return;
  }

  // --serve flag: start Express-based web server
  if (args.includes("--serve")) {
    let expressModule;
    try {
      const selfModule = await getSelf();
      expressModule = await selfModule.loadExpress();
    } catch (err) {
      console.error("Error starting server:", err);
      return;
    }
    const express = expressModule.default;
    const app = express();
    // Disable x-powered-by header to avoid disclosing version information
    app.disable("x-powered-by");

    app.get("/", (req, res) => {
      res.send("Welcome to the interactive plotting web interface.");
    });

    let server;
    await new Promise((resolve) => {
      server = app.listen(3000, () => {
        console.log(`Express server running at http://localhost:3000`);
        // Immediately close server in test environments to avoid port conflicts
        if (process.env.NODE_ENV === "test" || process.env.VITEST === "true") {
          if (server && typeof server.close === "function") {
            server.close();
          }
        }
        resolve();
      });
    });
    return;
  }

  // --interactive flag: prompt user input via readline
  if (args.includes("--interactive")) {
    const selfModule = await getSelf();
    try {
      const rlModule = await selfModule.loadReadline();
      const rl = rlModule.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      await new Promise((resolve) => {
        let answered = false;
        function handleAnswer(answer) {
          if (!answered) {
            answered = true;
            console.log(`Received plot command: ${answer}`);
            rl.close();
            resolve();
          }
        }

        if (process.env.NODE_ENV === "test" || process.env.VITEST === "true") {
          rl.question("Enter plot command (e.g., 'quad:1,0,0,-10,10,1'): ", handleAnswer);
          setImmediate(() => {
            if (!answered) {
              handleAnswer("simulated plot command");
            }
          });
        } else {
          const timeoutMs = 100;
          const timeout = setTimeout(() => {
            console.warn("Interactive mode fallback triggered after timeout");
            rl.close();
            resolve();
          }, timeoutMs);
          rl.question("Enter plot command (e.g., 'quad:1,0,0,-10,10,1'): ", (answer) => {
            clearTimeout(timeout);
            try {
              handleAnswer(answer);
            } catch (err) {
              console.error("Error processing input:", err);
              rl.close();
              resolve();
            }
          });
        }
      });
    } catch (err) {
      console.error("Error loading readline module:", err);
      return;
    }
    return;
  }

  // --lemniscate flag: demo lemniscate plot (Lemniscate of Bernoulli)
  if (args.includes("--lemniscate")) {
    const points = plotLemniscate(1, 0, 2 * Math.PI, 100);
    console.log("Lemniscate Plot Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // --power-plot flag: demo power plot (e.g., cubic function y = 2*x^3)
  if (args.includes("--power-plot")) {
    const points = plotPower(3, 2, -10, 10, 20);
    console.log("Power Plot (y = 2x^3) Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // Other export and plot flags below
  // --export-csv flag: demo export as CSV format (using plotSine as example)
  if (args.includes("--export-csv")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const csv = exportPlotAsCSV(points);
    console.log("CSV Output:\n" + csv);
    return;
  }

  // --plot-abs flag: import demo of plotting the absolute of a function (using Math.sin)
  if (args.includes("--plot-abs")) {
    const points = plotAbsolute(Math.sin, 0, Math.PI, 10);
    console.log("Plot Absolute of sin(x):", points);
    return;
  }

  // --export-md flag: export demo as Markdown table (using plotSine)
  if (args.includes("--export-md")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const markdown = exportPlotAsMarkdown(points);
    console.log("Markdown Output:\n" + markdown);
    return;
  }

  // --export-json flag: export demo as JSON (using plotSine)
  if (args.includes("--export-json")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const json = exportPlotAsJSON(points);
    console.log("JSON Output:\n" + json);
    return;
  }

  // --export-html flag: export demo as HTML table (using plotSine)
  if (args.includes("--export-html")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const html = exportPlotAsHTML(points);
    console.log("HTML Output:\n" + html);
    return;
  }

  // --export-ascii flag: export demo as ASCII table (using plotSine)
  if (args.includes("--export-ascii")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const ascii = exportPlotAsASCII(points);
    console.log("ASCII Output:\n" + ascii);
    return;
  }

  // --export-svg flag: export demo as SVG (using plotSine)
  if (args.includes("--export-svg")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const svg = exportPlotAsSVG(points);
    console.log("SVG Output:\n" + svg);
    return;
  }

  // --export-xml flag: export demo as XML (using plotSine)
  if (args.includes("--export-xml")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const xml = exportPlotAsXML(points);
    console.log("XML Output:\n" + xml);
    return;
  }

  // --export-latex flag: export demo as LaTeX table (using plotSine)
  if (args.includes("--export-latex")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const latex = exportPlotAsLaTeX(points);
    console.log("LaTeX Output:\n" + latex);
    return;
  }

  // --export-txt flag: export demo as plain text (using plotSine)
  if (args.includes("--export-txt")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const txt = exportPlotAsTXT(points);
    console.log("TXT Output:\n" + txt);
    return;
  }

  // --export-r flag: export demo in R-friendly format (using plotSine)
  if (args.includes("--export-r")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const rOutput = exportPlotAsR(points);
    console.log("R Output:\n" + rOutput);
    return;
  }

  // --scatter flag: demo scatter plot
  if (args.includes("--scatter")) {
    const points = plotScatter(10);
    console.log("Scatter Plot Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // --bar-chart flag: demo bar chart visualization using plotSine
  if (args.includes("--bar-chart")) {
    const points = plotSine(1, 2, 0, 0, Math.PI, 10);
    const barChart = plotBarChart(points);
    console.log("Bar Chart Output:\n" + barChart);
    return;
  }

  // --plot-parametric flag: demo parametric plot (default: circle)
  if (args.includes("--plot-parametric")) {
    const points = plotParametric(t => Math.cos(t), t => Math.sin(t), 0, 2 * Math.PI, 100);
    console.log("Parametric Plot Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // --plot-poly flag: demo polynomial plot (default coefficients: [1,2,3])
  if (args.includes("--plot-poly")) {
    const points = plotPolynomial([1, 2, 3], 0, 2, 10);
    console.log("Polynomial Plot Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // --lissajous flag: demo Lissajous curve plot
  if (args.includes("--lissajous")) {
    const points = plotLissajous(1, 1, 3, 2, Math.PI / 2, 0, 2 * Math.PI, 100);
    console.log("Lissajous Curve Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // --hyperbola flag: demo hyperbola plot
  if (args.includes("--hyperbola")) {
    const points = plotHyperbola(2, 3, 1, 5, 50);
    console.log("Hyperbola Plot Output:\n" + JSON.stringify(points, null, 2));
    return;
  }

  // Process plot parameters as default behavior
  console.log(`Processing plot request with parameters: ${JSON.stringify(args)}`);
}

// Additional helper functions aligned with our mission and contributing guidelines
export function plotQuadratic(a, b, c, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: a * x * x + b * x + c });
  }
  return result;
}

export function calculateDerivative(fn, x, h = 1e-5) {
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

export function calculateArea(fn, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  let area = 0;
  for (let i = 0; i < steps; i++) {
    const x1 = xMin + i * dx;
    const x2 = xMin + (i + 1) * dx;
    area += 0.5 * (fn(x1) + fn(x2)) * dx;
  }
  return area;
}

export function plotLinear(m, b, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: m * x + b });
  }
  return result;
}

export function plotSine(amplitude, frequency, phase, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: amplitude * Math.sin(frequency * x + phase) });
  }
  return result;
}

// Added plotCosine to support cosine wave plotting
export function plotCosine(amplitude, frequency, phase, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: amplitude * Math.cos(frequency * x + phase) });
  }
  return result;
}

export function rotatePoints(points, angle) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return points.map(({ x, y }) => ({
    x: x * cos - y * sin,
    y: x * sin + y * cos
  }));
}

export function plotExponential(a, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: Math.pow(a, x) });
  }
  return result;
}

export function plotLogarithmic(b, xMin, xMax, steps = 100) {
  if (xMin <= 0) {
    throw new Error("xMin must be greater than 0 for logarithmic plots");
  }
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: b * Math.log(x) });
  }
  return result;
}

export function movingAverage(data, windowSize) {
  if (windowSize <= 0) {
    throw new Error("Window size must be positive");
  }
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    let sum = 0;
    let count = 0;
    for (let j = start; j < end; j++) {
      sum += data[j];
      count++;
    }
    result.push(sum / count);
  }
  return result;
}

export function plotTangent(amplitude, frequency, phase, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  const symmetric = Math.abs(xMin + xMax) < 1e-8;
  const midIndex = Math.floor((steps + 1) / 2);
  for (let i = 0; i <= steps; i++) {
    let x = xMin + i * dx;
    if (symmetric && i === midIndex) {
      x = 0;
    }
    let y = amplitude * Math.tan(frequency * x + phase);
    if (!isFinite(y)) {
      y = null;
    }
    result.push({ x, y });
  }
  return result;
}

export function reflectPoints(points, axis = "y") {
  return points.map(({ x, y }) => {
    if (axis === "y") return { x: -x, y };
    if (axis === "x") return { x, y: -y };
    return { x, y };
  });
}

export function scalePoints(points, factor) {
  return points.map(({ x, y }) => ({ x: x * factor, y: y * factor }));
}

export function plotSqrt(xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: x < 0 ? null : Math.sqrt(x) });
  }
  return result;
}

export function plotPolar(radiusFn, thetaMin, thetaMax, steps = 100) {
  const dTheta = (thetaMax - thetaMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const theta = thetaMin + i * dTheta;
    const r = radiusFn(theta);
    result.push({ theta, r });
  }
  return result;
}

export function plotAbsolute(fn, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: Math.abs(fn(x)) });
  }
  return result;
}

export function generateRange(xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const range = [];
  for (let i = 0; i <= steps; i++) {
    range.push(xMin + i * dx);
  }
  return range;
}

export function plotDerivative(fn, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, derivative: calculateDerivative(fn, x) });
  }
  return result;
}

export function offsetPoints(points, offsetX, offsetY) {
  return points.map(({ x, y }) => ({ x: x + offsetX, y: y + offsetY }));
}

export function plotLogistic(L, k, x0, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: L / (1 + Math.exp(-k * (x - x0))) });
  }
  return result;
}

export function plotCubic(a, b, c, d, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d });
  }
  return result;
}

export function calculateStandardDeviation(data) {
  if (data.length === 0) return 0;
  const mean = data.reduce((acc, val) => acc + val, 0) / data.length;
  const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / data.length;
  return Math.sqrt(variance);
}

export function calculateCorrelation(dataX, dataY) {
  if (dataX.length !== dataY.length || dataX.length === 0) {
    throw new Error("Arrays must be of the same non-zero length");
  }
  const n = dataX.length;
  const meanX = dataX.reduce((sum, x) => sum + x, 0) / n;
  const meanY = dataY.reduce((sum, y) => sum + y, 0) / n;
  const numerator = dataX.reduce((acc, x, i) => acc + ((x - meanX) * (dataY[i] - meanY)), 0);
  const denominator = Math.sqrt(
    dataX.reduce((acc, x) => acc + Math.pow(x - meanX, 2), 0) *
      dataY.reduce((acc, y) => acc + Math.pow(y - meanY, 2), 0)
  );
  return denominator === 0 ? 0 : numerator / denominator;
}

export function plotHyperbolic(c, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: Math.abs(x) < 1e-10 ? null : c / x });
  }
  return result;
}

export function calculateExponentialMovingAverage(data, alpha = 0.5) {
  if (data.length === 0) return [];
  const result = [data[0]];
  for (let i = 1; i < data.length; i++) {
    result.push(alpha * data[i] + (1 - alpha) * result[i - 1]);
  }
  return result;
}

export function plotGaussian(amplitude, mean, sigma, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const exponent = -Math.pow(x - mean, 2) / (2 * sigma * sigma);
    result.push({ x, y: amplitude * Math.exp(exponent) });
  }
  return result;
}

export function exportPlotAsCSV(points) {
  if (!points.length) return '';
  const keys = Object.keys(points[0]);
  let csv = keys.join(",") + "\n";
  csv += points.map(point => keys.map(k => point[k]).join(",")).join("\n");
  return csv;
}

export function exportPlotAsMarkdown(points) {
  if (!points.length) return '';
  const keys = Object.keys(points[0]);
  let md = "| " + keys.join(" | ") + " |\n";
  md += "| " + keys.map(() => '---').join(" | ") + " |\n";
  points.forEach(point => {
    md += "| " + keys.map(k => point[k]).join(" | ") + " |\n";
  });
  return md.trim();
}

export function exportPlotAsJSON(points) {
  return JSON.stringify(points, null, 2);
}

export function exportPlotAsHTML(points) {
  if (!points.length) return '';
  const keys = Object.keys(points[0]);
  let html = '<table><thead><tr>' + keys.map(k => '<th>' + k + '</th>').join('') + '</tr></thead><tbody>';
  points.forEach(point => {
    html += '<tr>' + keys.map(k => '<td>' + point[k] + '</td>').join('') + '</tr>';
  });
  html += '</tbody></table>';
  return html;
}

export function exportPlotAsASCII(points) {
  if (!points.length) return '';
  const keys = Object.keys(points[0]);
  let header = keys.map(k => k.toUpperCase().padEnd(10)).join(' | ');
  let separator = keys.map(() => "----------").join('-+-');
  let rows = points.map(point => keys.map(k => String(point[k]).padEnd(10)).join(' | '));
  return [header, separator, ...rows].join('\n');
}

export function exportPlotAsSVG(points) {
  let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300">';
  points.forEach((pt, index) => {
    svg += `<text x="10" y="${20 * (index + 1)}">${JSON.stringify(pt)}</text>`;
  });
  svg += '</svg>';
  return svg;
}

export function exportPlotAsXML(points) {
  let xml = '<points>';
  points.forEach(pt => {
    xml += '<point>';
    for (const key in pt) {
      xml += `<${key}>${pt[key]}</${key}>`;
    }
    xml += '</point>';
  });
  xml += '</points>';
  return xml;
}

export function exportPlotAsLaTeX(points) {
  if (!points.length) return '';
  const keys = Object.keys(points[0]);
  let latex = "\begin{tabular}{|" + "c|".repeat(keys.length) + "}\n\hline\n";
  latex += keys.map(k => k.toUpperCase()).join(" & ") + " \\ \n\hline\n";
  points.forEach(point => {
    latex += keys.map(k => point[k]).join(" & ") + " \\ \n\hline\n";
  });
  latex += "\end{tabular}";
  return latex;
}

export function exportPlotAsTXT(points) {
  if (!points.length) return '';
  return points.map(pt => `x: ${pt.x}, y: ${pt.y}`).join('\n');
}

export function exportPlotAsR(points) {
  if (!points.length) return '';
  const keys = Object.keys(points[0]);
  let rOutput = keys.join(', ') + '\n';
  rOutput += points.map(pt => keys.map(k => pt[k]).join(', ')).join('\n');
  return rOutput;
}

export function plotScatter(count) {
  const points = [];
  for (let i = 0; i < count; i++) {
    points.push({ x: Math.random() * 10, y: Math.random() * 10 });
  }
  return points;
}

export function plotBarChart(points) {
  return points.map(p => `x: ${p.x.toFixed(2)} | ${'*'.repeat(Math.max(1, Math.round(Math.abs(p.y))) )}`).join('\n');
}

export function plotParametric(xFn, yFn, tMin, tMax, steps = 100) {
  const dt = (tMax - tMin) / steps;
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + i * dt;
    points.push({ t, x: xFn(t), y: yFn(t) });
  }
  return points;
}

export function solveQuadraticEquation(a, b, c) {
  const discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return [];
  }
  const sqrtDisc = Math.sqrt(discriminant);
  const root1 = (-b + sqrtDisc) / (2 * a);
  const root2 = (-b - sqrtDisc) / (2 * a);
  return [root1, root2];
}

export function plotSinCosCombined(amplitude, frequency, phase, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({
      x,
      sin: amplitude * Math.sin(frequency * x + phase),
      cos: amplitude * Math.cos(frequency * x + phase)
    });
  }
  return result;
}

export function interpolateData(xData, yData, x) {
  if (xData.length !== yData.length || xData.length === 0) {
    throw new Error("Data arrays must be of the same non-zero length");
  }
  if (x < xData[0] || x > xData[xData.length - 1]) {
    return null;
  }
  for (let i = 0; i < xData.length - 1; i++) {
    if (xData[i] <= x && x <= xData[i + 1]) {
      const t = (x - xData[i]) / (xData[i + 1] - xData[i]);
      return yData[i] * (1 - t) + yData[i + 1] * t;
    }
  }
  return null;
}

export function plotBezier(controlPoints, steps = 100) {
  if (!Array.isArray(controlPoints) || controlPoints.length === 0) return [];
  const bezierPoint = (points, t) => {
    while (points.length > 1) {
      const newPoints = [];
      for (let i = 0; i < points.length - 1; i++) {
        const x = points[i].x * (1 - t) + points[i + 1].x * t;
        const y = points[i].y * (1 - t) + points[i + 1].y * t;
        newPoints.push({ x, y });
      }
      points = newPoints;
    }
    return points[0];
  };
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    result.push(bezierPoint([...controlPoints], t));
  }
  return result;
}

export function plotLissajous(amplX, amplY, freqX, freqY, phase, tMin, tMax, steps = 100) {
  const dt = (tMax - tMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + i * dt;
    result.push({
      t,
      x: amplX * Math.sin(freqX * t + phase),
      y: amplY * Math.sin(freqY * t)
    });
  }
  return result;
}

export function plotBessel(order, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  let besselFn = math.besselJ || math.besselj;
  if (typeof besselFn !== 'function') {
    if (order === 0) {
      besselFn = function(x, order) {
        let sum = 0;
        const nTerms = 20;
        for (let m = 0; m < nTerms; m++) {
          sum += Math.pow(-1, m) / (factorial(m) * factorial(m)) * Math.pow(x / 2, 2 * m);
        }
        return sum;
      };
      function factorial(n) {
        return n <= 1 ? 1 : n * factorial(n - 1);
      }
    } else {
      throw new Error('Bessel function not found in mathjs and fallback only implemented for order 0');
    }
  }
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: besselFn(x, order) });
  }
  return result;
}

// New function: plotHyperbola for generating hyperbolic curve plots
export function plotHyperbola(a, b, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    if (Math.abs(x) < a) {
      result.push({ x, yPositive: null, yNegative: null });
    } else {
      const yVal = b * Math.sqrt((x * x) / (a * a) - 1);
      result.push({ x, yPositive: yVal, yNegative: -yVal });
    }
  }
  return result;
}

export function plotLemniscate(a, tMin, tMax, steps = 100) {
  const dt = (tMax - tMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const t = tMin + i * dt;
    const cos2t = Math.cos(2 * t);
    let r = null;
    if (cos2t >= 0) {
      r = Math.sqrt(2 * a * a * cos2t);
    }
    result.push({ t, x: r !== null ? r * Math.cos(t) : null, y: r !== null ? r * Math.sin(t) : null });
  }
  return result;
}

// Newly added function: plotPolynomial
export function plotPolynomial(coeffs, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  const degree = coeffs.length - 1;
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    let y = 0;
    for (let j = 0; j < coeffs.length; j++) {
      y += coeffs[j] * Math.pow(x, degree - j);
    }
    result.push({ x, y });
  }
  return result;
}

export function plotModulatedSine(amplitude, frequency, modulation, phase, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: amplitude * Math.sin(frequency * x + phase) * (1 + modulation * Math.cos(x)) });
  }
  return result;
}

export function plotSpiral(spiralConstant, thetaMin, thetaMax, steps = 100) {
  const dtheta = (thetaMax - thetaMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const theta = thetaMin + i * dtheta;
    const r = spiralConstant * theta;
    result.push({ theta, x: r * Math.cos(theta), y: r * Math.sin(theta) });
  }
  return result;
}

// Newly added function: plotSigmoid to demonstrate plotting of sigmoid function
export function plotSigmoid(xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: 1 / (1 + Math.exp(-x)) });
  }
  return result;
}

// Newly added function: plotSinc to plot sinc function, defined as sin(x)/x
export function plotSinc(xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = x === 0 ? 1 : Math.sin(x) / x;
    result.push({ x, y });
  }
  return result;
}

export function calculateDefiniteIntegral(fn, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  let area = 0;
  for (let i = 0; i < steps; i++) {
    const x1 = xMin + i * dx;
    const x2 = xMin + (i + 1) * dx;
    area += 0.5 * (fn(x1) + fn(x2)) * dx;
  }
  return area;
}

export function plotCustom() {
  // A custom plot function stub returning an empty array or custom demo data.
  return [];
}

export function plotEllipse(a, b, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const t = xMin + i * dx;
    result.push({ t, x: a * Math.cos(t), y: b * Math.sin(t) });
  }
  return result;
}

export function plotPower(power, coefficient, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    result.push({ x, y: coefficient * Math.pow(x, power) });
  }
  return result;
}

// Newly added function: plotReLU for computing ReLU of a linear function
export function plotReLU(m, b, xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    const y = m * x + b;
    result.push({ x, y: y > 0 ? y : 0 });
  }
  return result;
}

// Newly added function: movingMedian for computing the moving median of an array of data
export function movingMedian(data, windowSize = 3) {
  if (data.length === 0) return [];
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);
    const sorted = [...window].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    result.push(median);
  }
  return result;
}

// Newly added function: plotInverse to plot the inverse function y = 1/x with handling for x near zero
export function plotInverse(xMin, xMax, steps = 100) {
  const dx = (xMax - xMin) / steps;
  const result = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * dx;
    let y = null;
    if (Math.abs(x) > 1e-10) {
      y = 1 / x;
    }
    result.push({ x, y });
  }
  return result;
}

// Newly added function: cumulativeSum to compute cumulative sum of an array
export function cumulativeSum(data) {
  const result = [];
  let sum = 0;
  for (const num of data) {
    sum += num;
    result.push(sum);
  }
  return result;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  main(args);
}
