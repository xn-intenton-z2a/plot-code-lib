#!/usr/bin/env node

/* eslint-disable security/detect-unsafe-regex */
/* eslint-disable sonarjs/no-nested-conditional, sonarjs/cognitive-complexity, sonarjs/slow-regex, no-unused-vars, sonarjs/no-ignored-exceptions, no-useless-escape, sonarjs/no-redundant-jump */

/*
 * Equation Plotter Library
 *
 * This file contains all the functions required for parsing and generating plots from
 * mathematical formulas. It adheres to the contributing guidelines in CONTRIBUTING.md.
 *
 * Mission: Be a go-to plot library with a CLI, be the jq of formulae visualisations.
 *          This library supports plotting quadratic, linear, sine, cosine, tangent, polar,
 *          exponential, and logarithmic functions. It also includes advanced query filtering,
 *          summary statistics, rotation support and geometric computations for enhanced data insights.
 *
 * Change Log:
 *  - Updated mission statement and pruned outdated references.
 *  - Added support for advanced query filtering via advancedQueryPlotData function.
 *  - Extended rotation feature and summary statistics support.
 *  - Added new geometric computation functions: computeCentroid and computeBoundingBox.
 *  - Enhanced error reporting in file writing (plotToFile) for better testability.
 *  - Refreshed README documentation per CONTRIBUTING.md guidelines.
 *  - Retained PNG conversion stub as a placeholder for future implementation.
 */

'use strict';

import { fileURLToPath } from 'url';
import fs from 'fs';
import readline from 'readline';

// Utility Functions

/**
 * Generates an array of numbers from start up to end with a given step.
 * @param {number} start
 * @param {number} end
 * @param {number} [step=1]
 * @returns {number[]}
 */
const range = (start, end, step = 1) => {
  const arr = [];
  if (step > 0) {
    for (let i = start; i < end; i += step) {
      arr.push(i);
    }
  } else {
    for (let i = start; i > end; i += step) {
      arr.push(i);
    }
  }
  return arr;
};

/**
 * Formats a number to 2 decimal places, ensuring no -0.00 output.
 * @param {number} n
 * @returns {string}
 */
const formatNumber = (n) => {
  const s = n.toFixed(2);
  return s === '-0.00' ? '0.00' : s;
};

// New Helper Functions for Rotation Feature

/**
 * Rotates an array of points by a given angle in degrees.
 * @param {Array<{x: number, y: number}>} points
 * @param {number} angleDeg
 * @returns {Array<{x: number, y: number}>}
 */
const rotatePoints = (points, angleDeg) => {
  const angle = (angleDeg * Math.PI) / 180;
  return points.map(({ x, y }) => ({
    x: x * Math.cos(angle) - y * Math.sin(angle),
    y: x * Math.sin(angle) + y * Math.cos(angle)
  }));
};

/**
 * Applies rotation to all plot arrays in the plots object.
 * @param {Object} plots
 * @param {number} angleDeg
 * @returns {Object}
 */
const applyRotationToPlots = (plots, angleDeg) => {
  const rotatedPlots = {};
  for (const key in plots) {
    rotatedPlots[key] = plots[key].map(points => rotatePoints(points, angleDeg));
  }
  return rotatedPlots;
};

// Geometric Computation Functions

/**
 * Computes the centroid of an array of points.
 * @param {Array<{x: number, y: number}>} points
 * @returns {{x: number, y: number}}
 */
const computeCentroid = (points) => {
  if (points.length === 0) return { x: 0, y: 0 };
  const sum = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return { x: sum.x / points.length, y: sum.y / points.length };
};

/**
 * Computes the bounding box for an array of points.
 * @param {Array<{x: number, y: number}>} points
 * @returns {{minX: number, maxX: number, minY: number, maxY: number}}
 */
const computeBoundingBox = (points) => {
  if (points.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  return { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) };
};

// Plotting Functions

const plotQuadraticParam = ({ a = 1, b = 0, c = 0, xMin = -10, xMax = 10, step = 1 } = {}) => {
  const points = range(xMin, xMax + step, step).map((x) => ({ x, y: a * x * x + b * x + c }));
  return points;
};

const plotSineParam = ({ amplitude = 1, frequency = 1, phase = 0, xMin = 0, xMax = 360, step = 10 } = {}) => {
  const points = range(xMin, xMax + step, step).map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: deg, y: amplitude * Math.sin(frequency * rad + phase) };
  });
  return points;
};

const plotCosineParam = ({ amplitude = 1, frequency = 1, phase = 0, xMin = 0, xMax = 360, step = 10 } = {}) => {
  const points = range(xMin, xMax + step, step).map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return { x: deg, y: amplitude * Math.cos(frequency * rad + phase) };
  });
  return points;
};

const plotTangentParam = ({ amplitude = 1, frequency = 1, phase = 0, xMin = -45, xMax = 45, step = 1 } = {}) => {
  const points = [];
  for (let x = xMin; x <= xMax; x += step) {
    const rad = (x * Math.PI) / 180;
    const y = amplitude * Math.tan(frequency * rad + phase);
    // Skip points with extreme values due to discontinuities
    if (Math.abs(y) > 1000) continue;
    points.push({ x, y });
  }
  return points;
};

const plotPolarParam = ({ scale = 200, multiplier = 2, step = 5, degMin = 0, degMax = 360 } = {}) => {
  const points = range(degMin, degMax + step, step).map((deg) => {
    const rad = (deg * Math.PI) / 180;
    const r = scale * Math.abs(Math.sin(multiplier * rad));
    return { x: r * Math.cos(rad), y: r * Math.sin(rad) };
  });
  return points;
};

const plotLinearParam = ({ m = 1, b = 0, xMin = -10, xMax = 10, step = 1 } = {}) => {
  const points = range(xMin, xMax + step, step).map((x) => ({ x, y: m * x + b }));
  return points;
};

const plotExponentialParam = ({ a = 1, b = 1, xMin = -10, xMax = 10, step = 1 } = {}) => {
  const points = range(xMin, xMax + step, step).map((x) => ({ x, y: a * Math.exp(b * x) }));
  return points;
};

const plotLogarithmicParam = ({ a = 1, base = Math.E, xMin = 1, xMax = 10, step = 1 } = {}) => {
  const points = range(xMin, xMax + step, step).reduce((arr, x) => {
    if (x > 0) arr.push({ x, y: a * (Math.log(x) / Math.log(base)) });
    return arr;
  }, []);
  return points;
};

// Extended Function: PNG Conversion Stub
const plotToPng = ({ formulas = [], outputFileName = "output.png" } = {}) => {
  throw new Error("PNG conversion is not implemented yet.");
};

// Backward-compatible wrappers
const plotQuadratic = () => plotQuadraticParam();
const plotSine = () => plotSineParam();
const plotCosine = () => plotCosineParam();
const plotTangent = () => plotTangentParam();
const plotPolar = () => plotPolarParam();
// For demonstration, linear plot now uses y = 2x + 3
const plotLinear = () => plotLinearParam({ m: 2, b: 3 });
const plotExponential = () => plotExponentialParam();
const plotLogarithmic = () => plotLogarithmicParam();

// Formula Parsing Functions

const parseQuadratic = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid quadratic formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [a, b, c, xMin, xMax, step] = params;
  return plotQuadraticParam({
    a: isNaN(a) ? 1 : a,
    b: isNaN(b) ? 0 : b,
    c: isNaN(c) ? 0 : c,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
};

const parseSine = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2 || !parts[1].trim()) {
    throw new Error("Invalid sine formula string: " + formulaStr);
  }
  const rawParams = parts[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const params = rawParams.map(Number);
  if (params.length !== 6 || params.some((p) => isNaN(p))) {
    throw new Error("Invalid sine formula string: " + formulaStr);
  }
  const [amplitude, frequency, phase, xMin, xMax, step] = params;
  return plotSineParam({ amplitude, frequency, phase, xMin, xMax, step });
};

const parseCosine = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid cosine formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [amplitude, frequency, phase, xMin, xMax, step] = params;
  return plotCosineParam({
    amplitude: isNaN(amplitude) ? 1 : amplitude,
    frequency: isNaN(frequency) ? 1 : frequency,
    phase: isNaN(phase) ? 0 : phase,
    xMin: isNaN(xMin) ? 0 : xMin,
    xMax: isNaN(xMax) ? 360 : xMax,
    step: isNaN(step) ? 10 : step
  });
};

const parseTangent = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid tangent formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [amplitude, frequency, phase, xMin, xMax, step] = params;
  return plotTangentParam({
    amplitude: isNaN(amplitude) ? 1 : amplitude,
    frequency: isNaN(frequency) ? 1 : frequency,
    phase: isNaN(phase) ? 0 : phase,
    xMin: isNaN(xMin) ? -45 : xMin,
    xMax: isNaN(xMax) ? 45 : xMax,
    step: isNaN(step) ? 1 : step
  });
};

const parsePolar = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid polar formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const scale = isNaN(params[0]) ? 200 : params[0];
  const multiplier = isNaN(params[1]) ? 2 : params[1];
  const step = params.length >= 3 ? (isNaN(params[2]) ? 5 : params[2]) : 5;
  const degMin = params.length >= 5 ? (isNaN(params[3]) ? 0 : params[3]) : 0;
  const degMax = params.length >= 5 ? (isNaN(params[4]) ? 360 : params[4]) : 360;
  return plotPolarParam({ scale, multiplier, step, degMin, degMax });
};

const parseLinear = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid linear formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [m, b, xMin, xMax, step] = params;
  return plotLinearParam({
    m: isNaN(m) ? 1 : m,
    b: isNaN(b) ? 0 : b,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
};

const parseGenericLinear = (formulaStr) => {
  const parts = formulaStr.split(":");
  const exprPart = parts[0].replace(/\s+/g, "");
  const rangePart = parts.length > 1 ? parts[1].trim() : "";
  if (!exprPart.toLowerCase().startsWith("y=")) {
    throw new Error("Linear formula must start with 'y=': " + formulaStr);
  }
  const expr = exprPart.substring(2);
  if (expr.includes("x^2")) {
    throw new Error("Detected quadratic term in a linear formula: " + formulaStr);
  }
  let m = 1;
  let b = 0;
  const mMatch = expr.match(/^([+-]?\d*(?:\.\d+)?)\*?x/);
  if (mMatch) {
    m = mMatch[1] === "" || mMatch[1] === undefined ? 1 : parseFloat(mMatch[1]);
  }
  const bMatch = expr.match(/([+-]\d*(?:\.\d+)?)(?!\*?x)/);
  if (bMatch) {
    b = parseFloat(bMatch[1]);
  }
  let xMin = -10;
  let xMax = 10;
  let step = 1;
  if (rangePart) {
    const rangeParams = rangePart.split(",").map(Number);
    if (rangeParams.length > 0 && !isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (rangeParams.length > 1 && !isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (rangeParams.length > 2 && !isNaN(rangeParams[2])) step = rangeParams[2];
  }
  return plotLinearParam({ m, b, xMin, xMax, step });
};

const parseGenericQuadratic = (formulaStr) => {
  const parts = formulaStr.split(":");
  const mainPart = parts[0].replace(/\s+/g, "").toLowerCase();
  const rangePart = parts.length > 1 ? parts[1].trim() : "";
  let xMin = -10;
  let xMax = 10;
  let step = 1;
  if (rangePart) {
    const rangeParams = rangePart.split(",").map(Number);
    if (rangeParams.length > 0 && !isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (rangeParams.length > 1 && !isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (rangeParams.length > 2 && !isNaN(rangeParams[2])) step = rangeParams[2];
  }

  if (mainPart.startsWith("y=")) {
    const yExpr = mainPart.substring(2);
    const coeffs = extractQuadraticCoefficients(yExpr);
    return plotQuadraticParam({ ...coeffs, xMin, xMax, step });
  } else if (mainPart.endsWith("=0")) {
    const left = mainPart.split("=")[0];
    const yRegex = /([+-]?\d*(?:\.\d+)?)y/;
    const yMatch = left.match(yRegex);
    if (!yMatch) throw new Error("No y term found in equation: " + formulaStr);
    const coeffStr = yMatch[1];
    const yCoeff = coeffStr === "" || coeffStr === "+" ? 1 : coeffStr === "-" ? -1 : parseFloat(coeffStr);
    const remaining = left.replace(yRegex, "");
    const cleanedRemaining = remaining.replace(/^\+/, "");
    const coeffs = extractQuadraticCoefficients(cleanedRemaining);
    return plotQuadraticParam({
      a: -coeffs.a / yCoeff,
      b: -coeffs.b / yCoeff,
      c: -coeffs.c / yCoeff,
      xMin,
      xMax,
      step
    });
  } else {
    const partsEq = mainPart.split("=");
    if (partsEq.length !== 2) throw new Error("Unsupported quadratic formula format: " + formulaStr);
    const left = partsEq[0];
    const right = partsEq[1] || "0";
    if (left.includes("y")) {
      const yMatch = left.match(/([+-]?\d*(?:\.\d+)?)y/);
      let yCoeff = 1;
      if (yMatch) {
        const coeffStr = yMatch[1];
        yCoeff = coeffStr === "" || coeffStr === "+" ? 1 : coeffStr === "-" ? -1 : parseFloat(coeffStr);
      }
      const remaining = left.replace(/([+-]?\d*(?:\.\d+)?)y/, "");
      const constantRight = parseFloat(right) || 0;
      const coeffs = extractQuadraticCoefficients(remaining);
      return plotQuadraticParam({
        a: -coeffs.a / yCoeff,
        b: -coeffs.b / yCoeff,
        c: (constantRight - coeffs.c) / yCoeff,
        xMin,
        xMax,
        step
      });
    } else if (right.includes("y")) {
      const yMatch = right.match(/([+-]?\d*(?:\.\d+)?)y/);
      let yCoeff = 1;
      if (yMatch) {
        const coeffStr = yMatch[1];
        yCoeff = coeffStr === "" || coeffStr === "+" ? 1 : coeffStr === "-" ? -1 : parseFloat(coeffStr);
      }
      const remaining = right.replace(/([+-]?\d*(?:\.\d+)?)y/, "");
      const constantLeft = parseFloat(left) || 0;
      const coeffs = extractQuadraticCoefficients(remaining);
      return plotQuadraticParam({
        a: -coeffs.a / yCoeff,
        b: -coeffs.b / yCoeff,
        c: (constantLeft - coeffs.c) / yCoeff,
        xMin,
        xMax,
        step
      });
    } else {
      const newExpr = (right || "0") + invertExpression(left);
      return plotQuadraticParam({ ...extractQuadraticCoefficients(newExpr), xMin, xMax, step });
    }
  }
};

const parseExponential = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid exponential formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [a, b, xMin, xMax, step] = params;
  return plotExponentialParam({
    a: isNaN(a) ? 1 : a,
    b: isNaN(b) ? 1 : b,
    xMin: isNaN(xMin) ? -10 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
};

const parseGenericExponential = (formulaStr) => {
  const parts = formulaStr.split(":");
  const exprPart = parts[0].replace(/\s+/g, "");
  const rangePart = parts.length > 1 ? parts[1].trim() : "";
  let xMin = -10;
  let xMax = 10;
  let step = 1;
  if (rangePart) {
    const rangeParams = rangePart.split(",").map(Number);
    if (rangeParams.length > 0 && !isNaN(rangeParams[0])) xMin = rangeParams[0];
    if (rangeParams.length > 1 && !isNaN(rangeParams[1])) xMax = rangeParams[1];
    if (rangeParams.length > 2 && !isNaN(rangeParams[2])) step = rangeParams[2];
  }
  const regex = /^y=([+-]?\d*(?:\.\d+)?)\*?e\^\(?([+-]?\d+(?:\.\d+)?)\*?x\)?/i;
  const match = exprPart.match(regex);
  if (match) {
    const a = match[1] ? parseFloat(match[1]) : 1;
    const b = parseFloat(match[2]);
    return plotExponentialParam({ a, b, xMin, xMax, step });
  } else {
    throw new Error("Invalid generic exponential formula string: " + formulaStr);
  }
};

const parseLogarithmic = (formulaStr) => {
  const parts = formulaStr.split(":");
  if (parts.length < 2) throw new Error("Invalid logarithmic formula string: " + formulaStr);
  const params = parts[1].split(",").map(Number);
  const [a, base, xMin, xMax, step] = params;
  return plotLogarithmicParam({
    a: isNaN(a) ? 1 : a,
    base: isNaN(base) ? Math.E : base,
    xMin: isNaN(xMin) ? 1 : xMin,
    xMax: isNaN(xMax) ? 10 : xMax,
    step: isNaN(step) ? 1 : step
  });
};

// Helper functions for quadratic parsing
const extractQuadraticCoefficients = (expr) => {
  let cleanedExpr = expr.replace(/\s+/g, "").replace(/\+\-/g, "-");
  let a = 0;
  let b = 0;
  let c = 0;
  const aMatch = cleanedExpr.match(/([+-]?\d*(?:\.\d+)?)x\^2/);
  if (aMatch) {
    const coeff = aMatch[1];
    a = coeff === "" || coeff === "+" ? 1 : coeff === "-" ? -1 : parseFloat(coeff);
    cleanedExpr = cleanedExpr.replace(aMatch[0], "");
  }
  const bMatch = cleanedExpr.match(/([+-]?\d+(?:\.\d+)?)x(?!\^)/);
  if (bMatch) {
    const coeff = bMatch[1];
    b = coeff === "" || coeff === "+" ? 1 : coeff === "-" ? -1 : parseFloat(coeff);
    cleanedExpr = cleanedExpr.replace(bMatch[0], "");
  }
  const constantMatches = cleanedExpr.match(/([+-]?\d*(?:\.\d+)?)/g);
  if (constantMatches) {
    c = constantMatches.reduce((sum, numStr) => sum + parseFloat(numStr || 0), 0);
  }
  return { a, b, c };
};

const invertExpression = (expr) => {
  const tokens = expr.match(/[+-]?[^+-]+/g) || [];
  const inverted = tokens
    .map((token) => {
      token = token.trim();
      if (token.startsWith("-")) {
        return "+" + token.slice(1);
      } else {
        return "-" + token;
      }
    })
    .join("");
  return inverted.startsWith("+") ? inverted.slice(1) : inverted;
};

// Delegate plotting based on formula string
const plotFromString = (formulaStr) => {
  formulaStr = formulaStr.trim();
  const lowerStr = formulaStr.toLowerCase();
  if (lowerStr.startsWith("y=")) {
    if (formulaStr.toLowerCase().includes("e^")) {
      try {
        return parseGenericExponential(formulaStr);
      } catch (error) {
        return [];
      }
    } else if (formulaStr.toLowerCase().includes("log(")) {
      try {
        return parseLogarithmic(formulaStr);
      } catch (error) {
        return [];
      }
    } else if (!formulaStr.includes("x^2") && !formulaStr.toLowerCase().includes("tan(")) {
      try {
        return parseGenericLinear(formulaStr);
      } catch (error) {
        return [];
      }
    } else {
      try {
        return parseGenericQuadratic(formulaStr);
      } catch (error) {
        return [];
      }
    }
  } else if (formulaStr.includes(":")) {
    if (lowerStr.startsWith("log:") || lowerStr.startsWith("ln:")) return parseLogarithmic(formulaStr);
    if (lowerStr.startsWith("quadratic:") || lowerStr.startsWith("quad:")) return parseQuadratic(formulaStr);
    if (lowerStr.startsWith("sine:")) return parseSine(formulaStr);
    if (lowerStr.startsWith("cosine:") || lowerStr.startsWith("cos:")) return parseCosine(formulaStr);
    if (lowerStr.startsWith("tangent:")) return parseTangent(formulaStr);
    if (lowerStr.startsWith("polar:")) return parsePolar(formulaStr);
    if (lowerStr.startsWith("linear:")) return parseLinear(formulaStr);
    if (lowerStr.startsWith("exponential:") || lowerStr.startsWith("exp:")) return parseExponential(formulaStr);
    return [];
  } else if (formulaStr.includes("=")) {
    try {
      return parseGenericQuadratic(formulaStr);
    } catch (error) {
      return [];
    }
  } else {
    return [];
  }
};

// Group plots by type
const getPlotsFromFormulas = (formulas = []) => {
  const quadratic = [];
  const sine = [];
  const cosine = [];
  const tangent = [];
  const polar = [];
  const linear = [];
  const exponential = [];
  const logarithmic = [];
  formulas.forEach((formula) => {
    const lower = formula.toLowerCase();
    try {
      if (
        lower.startsWith("quad:") ||
        lower.startsWith("quadratic:") ||
        (formula.includes("x^2") && formula.includes("="))
      ) {
        quadratic.push(plotFromString(formula));
      } else if (lower.startsWith("sine:")) {
        sine.push(plotFromString(formula));
      } else if (lower.startsWith("cosine:") || lower.startsWith("cos:")) {
        cosine.push(parseCosine(formula));
      } else if (lower.startsWith("tangent:")) {
        tangent.push(parseTangent(formula));
      } else if (lower.startsWith("polar:")) {
        polar.push(plotFromString(formula));
      } else if (
        lower.startsWith("linear:") ||
        (lower.startsWith("y=") &&
          !formula.includes("x^2") &&
          !formula.toLowerCase().includes("e^") &&
          !formula.toLowerCase().includes("log(") &&
          !formula.toLowerCase().includes("tan("))
      ) {
        linear.push(plotFromString(formula));
      } else if (
        lower.startsWith("exponential:") ||
        lower.startsWith("exp:") ||
        (lower.startsWith("y=") && formula.toLowerCase().includes("e^"))
      ) {
        exponential.push(plotFromString(formula));
      } else if (
        lower.startsWith("log:") ||
        lower.startsWith("ln:") ||
        (lower.startsWith("y=") && formula.toLowerCase().includes("log("))
      ) {
        logarithmic.push(plotFromString(formula));
      }
    } catch (error) {
      // Ignore parsing errors
    }
  });
  if (quadratic.length === 0) quadratic.push(plotQuadratic());
  if (linear.length === 0) linear.push(plotLinear());
  if (sine.length === 0) sine.push(plotSine());
  if (cosine.length === 0) cosine.push(plotCosine());
  if (tangent.length === 0) tangent.push(plotTangent());
  if (polar.length === 0) polar.push(plotPolar());
  if (exponential.length === 0) exponential.push(plotExponential());
  if (logarithmic.length === 0) logarithmic.push(plotLogarithmic());
  return { quadratic, linear, sine, cosine, tangent, polar, exponential, logarithmic };
};

// New Feature: Compute Summary Statistics for each plot type
const getPlotStats = (plotsObj) => {
  const stats = {};
  Object.entries(plotsObj).forEach(([type, plotsArray]) => {
    const allPoints = plotsArray.flat();
    if (allPoints.length > 0) {
      stats[type] = {
        count: allPoints.length,
        minX: Math.min(...allPoints.map(p => p.x)),
        maxX: Math.max(...allPoints.map(p => p.x)),
        minY: Math.min(...allPoints.map(p => p.y)),
        maxY: Math.max(...allPoints.map(p => p.y))
      };
    } else {
      stats[type] = null;
    }
  });
  return stats;
};

// New Feature: Query Plot Data
/**
 * Filters plot data based on a predicate, similar to jq filtering functionality.
 * @param {Object} plots - An object containing arrays of plot points keyed by plot type.
 * @param {function} predicate - A callback function that accepts a point and returns a boolean.
 * @returns {Object} - A new plots object with filtered points.
 */
const queryPlotData = (plots, predicate) => {
  const filteredPlots = {};
  for (const type in plots) {
    filteredPlots[type] = plots[type].map(points => points.filter(predicate));
  }
  return filteredPlots;
};

// New Feature: Advanced Query Filtering
/**
 * Filters plot data based on separate predicates for x and y values.
 * @param {Object} plots - An object containing arrays of plot points keyed by plot type.
 * @param {Object} filters - An object with predicates for x and y. Example: { x: (val) => val > 0, y: (val) => val < 10 }
 * @returns {Object} - A new plots object with filtered points.
 */
const advancedQueryPlotData = (plots, { x, y }) => {
  const filteredPlots = {};
  for (const type in plots) {
    filteredPlots[type] = plots[type].map(points => points.filter(point => x(point.x) && y(point.y)));
  }
  return filteredPlots;
};

// SVG Generation Function
const generateSvg = (
  quadraticPlots,
  linearPlots,
  sinePlots,
  cosinePlots,
  tangentPlots,
  polarPlots,
  exponentialPlots,
  logarithmicPlots,
  gridEnabled = false
) => {
  const width = 800;
  // Updated layout positions
  // Quadratic: 50 to 230
  // Linear: 270 to 450
  // Sine: 490 to 670
  // Cosine: 710 to 890
  // Tangent: 930 to 1110
  // Polar: 1150 to 1330 (special drawing)
  // Exponential: 1370 to 1550
  // Logarithmic: 1570 to 1750
  let svg = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  svg += `<svg width="${width}" height="1800" viewBox="0 0 ${width} 1800" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">\n`;
  svg += `  <rect width="100%" height="100%" fill="white" />\n`;

  const defaultColors = {
    quadratic: ["blue", "darkblue", "purple", "royalblue", "deepskyblue"],
    linear: ["orange", "darkorange", "gold", "chocolate", "peru"],
    sine: ["red", "darkred", "crimson", "firebrick", "tomato"],
    cosine: ["teal", "darkcyan", "cadetblue", "lightseagreen", "mediumturquoise"],
    tangent: ["black", "gray"],
    polar: ["green", "darkgreen", "limegreen", "seagreen", "forestgreen"],
    exponential: ["magenta", "darkmagenta", "violet", "indigo", "purple"],
    logarithmic: ["brown", "saddlebrown", "peru", "chocolate", "tan"]
  };

  const drawRectGrid = (x, y, w, h, vCount, hCount) => {
    let grid = "";
    range(0, vCount + 1, 1).forEach((i) => {
      const gx = x + i * (w / vCount);
      grid += `  <line x1="${formatNumber(gx)}" y1="${formatNumber(y)}" x2="${formatNumber(x + w)}" y2="${formatNumber(y + h)}" stroke="#eee" stroke-width="1" />\n`;
    });
    range(0, hCount + 1, 1).forEach((i) => {
      const gy = y + i * (h / hCount);
      grid += `  <line x1="${formatNumber(x)}" y1="${formatNumber(gy)}" x2="${formatNumber(x + w)}" y2="${formatNumber(y + h)}" stroke="#eee" stroke-width="1" />\n`;
    });
    return grid;
  };

  const drawRectAxes = (x, y, w, h, minX, maxX, minY, maxY) => {
    let axes = "";
    if (0 >= minY && 0 <= maxY) {
      const zeroY = y + h - ((0 - minY) / (maxY - minY)) * h;
      axes += `  <line x1="${formatNumber(x)}" y1="${formatNumber(zeroY)}" x2="${formatNumber(x + w)}" y2="${formatNumber(zeroY)}" stroke="black" stroke-width="1" />\n`;
    }
    if (0 >= minX && 0 <= maxX) {
      const zeroX = x + ((0 - minX) / (maxX - minX)) * w;
      axes += `  <line x1="${formatNumber(zeroX)}" y1="${formatNumber(y)}" x2="${formatNumber(zeroX)}" y2="${formatNumber(y + h)}" stroke="black" stroke-width="1" />\n`;
    }
    return axes;
  };

  // Quadratic Plot
  svg += `  <text x="${width / 2}" y="30" font-size="16" text-anchor="middle">Quadratic Plot: y = ax² + bx + c</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 50, 700, 180, 10, 5);
    const qAll = quadraticPlots.flat();
    svg += drawRectAxes(
      50,
      50,
      700,
      180,
      Math.min(...qAll.map((p) => p.x)),
      Math.max(...qAll.map((p) => p.x)),
      Math.min(...qAll.map((p) => p.y)),
      Math.max(...qAll.map((p) => p.y))
    );
  }
  const qAllPoints = quadraticPlots.flat();
  let qMinY = Math.min(...qAllPoints.map((p) => p.y));
  let qMaxY = Math.max(...qAllPoints.map((p) => p.y));
  if (qMinY === qMaxY) {
    qMinY -= 10;
    qMaxY += 10;
  }
  const qAllX = qAllPoints.map((p) => p.x);
  let qMinX = Math.min(...qAllX);
  let qMaxX = Math.max(...qAllX);
  if (qMinX === qMaxX) {
    qMinX -= 10;
    qMaxX += 10;
  }
  quadraticPlots.forEach((points, idx) => {
    const color = defaultColors.quadratic[idx % defaultColors.quadratic.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - qMinX) / (qMaxX - qMinX)) * 700;
        const py = 230 - ((p.y - qMinY) / (qMaxY - qMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Linear Plot
  svg += `  <text x="${width / 2}" y="250" font-size="16" text-anchor="middle">Linear Plot: y = m*x + b</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 270, 700, 180, 10, 5);
    const lAll = linearPlots.flat();
    svg += drawRectAxes(
      50,
      270,
      700,
      180,
      Math.min(...lAll.map((p) => p.x)),
      Math.max(...lAll.map((p) => p.x)),
      Math.min(...lAll.map((p) => p.y)),
      Math.max(...lAll.map((p) => p.y))
    );
  }
  const lAllPoints = linearPlots.flat();
  let lMinY = Math.min(...lAllPoints.map((p) => p.y));
  let lMaxY = Math.max(...lAllPoints.map((p) => p.y));
  if (lMinY === lMaxY) {
    lMinY -= 10;
    lMaxY += 10;
  }
  const lAllX = lAllPoints.map((p) => p.x);
  let lMinX = Math.min(...lAllX);
  let lMaxX = Math.max(...lAllX);
  if (lMinX === lMaxX) {
    lMinX -= 10;
    lMaxX += 10;
  }
  linearPlots.forEach((points, idx) => {
    const color = defaultColors.linear[idx % defaultColors.linear.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - lMinX) / (lMaxX - lMinX)) * 700;
        const py = 450 - ((p.y - lMinY) / (lMaxY - lMinY)) * 180;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Sine Plot
  svg += `  <text x="${width / 2}" y="490" font-size="16" text-anchor="middle">Sine Plot: y = A*sin(B*x + C)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 510, 700, 160, 10, 5);
    const sAll = sinePlots.flat();
    svg += drawRectAxes(
      50,
      510,
      700,
      160,
      Math.min(...sAll.map((p) => p.x)),
      Math.max(...sAll.map((p) => p.x)),
      Math.min(...sAll.map((p) => p.y)),
      Math.max(...sAll.map((p) => p.y))
    );
  }
  const sAllPoints = sinePlots.flat();
  let sMinY = Math.min(...sAllPoints.map((p) => p.y));
  let sMaxY = Math.max(...sAllPoints.map((p) => p.y));
  if (sMinY === sMaxY) {
    sMinY -= 1;
    sMaxY += 1;
  }
  const sAllX = sAllPoints.map((p) => p.x);
  let sMinX = Math.min(...sAllX);
  let sMaxX = Math.max(...sAllX);
  if (sMinX === sMaxX) {
    sMinX -= 10;
    sMaxX += 10;
  }
  sinePlots.forEach((points, idx) => {
    const color = defaultColors.sine[idx % defaultColors.sine.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - sMinX) / (sMaxX - sMinX)) * 700;
        const py = 670 - ((p.y - sMinY) / (sMaxY - sMinY)) * 160;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Cosine Plot
  svg += `  <text x="${width / 2}" y="710" font-size="16" text-anchor="middle">Cosine Plot: y = A*cos(B*x + C)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 730, 700, 160, 10, 5);
    const cAll = cosinePlots.flat();
    svg += drawRectAxes(
      50,
      730,
      700,
      160,
      Math.min(...cAll.map((p) => p.x)),
      Math.max(...cAll.map((p) => p.x)),
      Math.min(...cAll.map((p) => p.y)),
      Math.max(...cAll.map((p) => p.y))
    );
  }
  const cAllPoints = cosinePlots.flat();
  let cMinY = Math.min(...cAllPoints.map((p) => p.y));
  let cMaxY = Math.max(...cAllPoints.map((p) => p.y));
  if (cMinY === cMaxY) {
    cMinY -= 1;
    cMaxY += 1;
  }
  const cAllX = cAllPoints.map((p) => p.x);
  let cMinX = Math.min(...cAllX);
  let cMaxX = Math.max(...cAllX);
  if (cMinX === cMaxX) {
    cMinX -= 10;
    cMaxX += 10;
  }
  cosinePlots.forEach((points, idx) => {
    const color = defaultColors.cosine[idx % defaultColors.cosine.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - cMinX) / (cMaxX - cMinX)) * 700;
        const py = 890 - ((p.y - cMinY) / (cMaxY - cMinY)) * 160;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Tangent Plot
  svg += `  <text x="${width / 2}" y="930" font-size="16" text-anchor="middle">Tangent Plot: y = A*tan(B*x + C)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 950, 700, 160, 10, 5);
    const tAll = tangentPlots.flat();
    svg += drawRectAxes(
      50,
      950,
      700,
      160,
      Math.min(...tAll.map((p) => p.x)),
      Math.max(...tAll.map((p) => p.x)),
      Math.min(...tAll.map((p) => p.y)),
      Math.max(...tAll.map((p) => p.y))
    );
  }
  const tAllPoints = tangentPlots.flat();
  let tMinY = Math.min(...tAllPoints.map((p) => p.y));
  let tMaxY = Math.max(...tAllPoints.map((p) => p.y));
  if (tMinY === tMaxY) {
    tMinY -= 10;
    tMaxY += 10;
  }
  const tAllX = tAllPoints.map((p) => p.x);
  let tMinX = Math.min(...tAllX);
  let tMaxX = Math.max(...tAllX);
  if (tMinX === tMaxX) {
    tMinX -= 10;
    tMaxX += 10;
  }
  tangentPlots.forEach((points, idx) => {
    const color = defaultColors.tangent[idx % defaultColors.tangent.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - tMinX) / (tMaxX - tMinX)) * 700;
        const py = 1110 - ((p.y - tMinY) / (tMaxY - tMinY)) * 160;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Polar Plot (special rendering with circles and axes)
  svg += `  <text x="${width / 2}" y="1150" font-size="16" text-anchor="middle">Polar Plot: r = scale * |sin(multiplier * θ)|</text>\n`;
  const centerX = width / 2;
  const centerY = 1190;
  if (gridEnabled) {
    [50, 100, 150].forEach((r) => {
      svg += `  <circle cx="${formatNumber(centerX)}" cy="${formatNumber(centerY)}" r="${r}" stroke="#eee" stroke-width="1" fill="none" />\n`;
    });
    svg += `  <line x1="${formatNumber(centerX - 150)}" y1="${formatNumber(centerY)}" x2="${formatNumber(centerX + 150)}" y2="${formatNumber(centerY)}" stroke="black" stroke-width="1" />\n`;
    svg += `  <line x1="${formatNumber(centerX)}" y1="${formatNumber(centerY - 150)}" x2="${formatNumber(centerX)}" y2="${formatNumber(centerY + 150)}" stroke="black" stroke-width="1" />\n`;
  }
  polarPlots.forEach((points, idx) => {
    const color = defaultColors.polar[idx % defaultColors.polar.length];
    const pts = points
      .map((p) => {
        const px = centerX + p.x;
        const py = centerY - p.y;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Exponential Plot
  svg += `  <text x="${width / 2}" y="1370" font-size="16" text-anchor="middle">Exponential Plot: y = a * e^(b*x)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 1390, 700, 160, 10, 5);
    const expAll = exponentialPlots.flat();
    svg += drawRectAxes(
      50,
      1390,
      700,
      160,
      Math.min(...expAll.map((p) => p.x)),
      Math.max(...expAll.map((p) => p.x)),
      Math.min(...expAll.map((p) => p.y)),
      Math.max(...expAll.map((p) => p.y))
    );
  }
  const expAllPoints = exponentialPlots.flat();
  let expMinY = Math.min(...expAllPoints.map((p) => p.y));
  let expMaxY = Math.max(...expAllPoints.map((p) => p.y));
  if (expMinY === expMaxY) {
    expMinY -= 10;
    expMaxY += 10;
  }
  const expAllX = exponentialPlots.flat().map((p) => p.x);
  let expMinX = Math.min(...expAllX);
  let expMaxX = Math.max(...expAllX);
  if (expMinX === expMaxX) {
    expMinX -= 10;
    expMaxX += 10;
  }
  exponentialPlots.forEach((points, idx) => {
    const color = defaultColors.exponential[idx % defaultColors.exponential.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - expMinX) / (expMaxX - expMinX)) * 700;
        const py = 1550 - ((p.y - expMinY) / (expMaxY - expMinY)) * 160;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });
  svg += "\n";

  // Logarithmic Plot
  svg += `  <text x="${width / 2}" y="1570" font-size="16" text-anchor="middle">Logarithmic Plot: y = a * log_b(x)</text>\n`;
  if (gridEnabled) {
    svg += drawRectGrid(50, 1590, 700, 160, 10, 5);
    const logAll = logarithmicPlots.flat();
    svg += drawRectAxes(
      50,
      1590,
      700,
      160,
      Math.min(...logAll.map((p) => p.x)),
      Math.max(...logAll.map((p) => p.x)),
      Math.min(...logAll.map((p) => p.y)),
      Math.max(...logAll.map((p) => p.y))
    );
  }
  const logAllPoints = logarithmicPlots.flat();
  let logMinY = Math.min(...logAllPoints.map((p) => p.y));
  let logMaxY = Math.max(...logAllPoints.map((p) => p.y));
  if (logMinY === logMaxY) {
    logMinY -= 10;
    logMaxY += 10;
  }
  const logAllX = logarithmicPlots.flat().map((p) => p.x);
  let logMinX = Math.min(...logAllX);
  let logMaxX = Math.max(...logAllX);
  if (logMinX === logMaxX) {
    logMinX -= 10;
    logMaxX += 10;
  }
  logarithmicPlots.forEach((points, idx) => {
    const color = defaultColors.logarithmic[idx % defaultColors.logarithmic.length];
    const pts = points
      .map((p) => {
        const px = 50 + ((p.x - logMinX) / (logMaxX - logMinX)) * 700;
        const py = 1750 - ((p.y - logMinY) / (logMaxY - logMinY)) * 160;
        return `${formatNumber(px)},${formatNumber(py)}`;
      })
      .join(" ");
    svg += `  <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" />\n`;
  });

  svg += "</svg>";
  return svg;
};

// HTML Generation Function
const plotToHtml = ({ formulas = [], grid = false, rotationAngle = 0 } = {}) => {
  const svgContent = plotToSvg({ formulas, grid, rotationAngle });
  return `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Equation Plot</title>\n  <style>\n    body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f8f8f8; }\n  </style>\n</head>\n<body>\n  <div>\n    ${svgContent}\n  </div>\n</body>\n</html>`;
};

// Markdown Generation Function
const plotToMarkdown = ({ formulas = [], rotationAngle = 0 } = {}) => {
  const { quadratic, linear, sine, cosine, tangent, polar, exponential, logarithmic } = (rotationAngle && rotationAngle !== 0) ? applyRotationToPlots(getPlotsFromFormulas(formulas), rotationAngle) : getPlotsFromFormulas(formulas);
  let md = "# Plot Data\n\n";
  md += "## Quadratic Plot:\n";
  quadratic.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Linear Plot:\n";
  linear.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Sine Plot:\n";
  sine.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Cosine Plot:\n";
  cosine.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Tangent Plot:\n";
  tangent.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Polar Plot:\n";
  polar.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Exponential Plot:\n";
  exponential.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  md += "## Logarithmic Plot:\n";
  logarithmic.forEach((points, i) => {
    md +=
      `**Formula ${i + 1}:** ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ") + "\n\n";
  });
  return md;
};

const plotToSvg = ({ formulas = [], grid = false, rotationAngle = 0 } = {}) => {
  let plots = getPlotsFromFormulas(formulas);
  if (rotationAngle && rotationAngle !== 0) {
    plots = applyRotationToPlots(plots, rotationAngle);
  }
  return generateSvg(plots.quadratic, plots.linear, plots.sine, plots.cosine, plots.tangent, plots.polar, plots.exponential, plots.logarithmic, grid);
};

const plotToAscii = ({ formulas = [], rotationAngle = 0 } = {}) => {
  const { sine } = (rotationAngle && rotationAngle !== 0) ? applyRotationToPlots(getPlotsFromFormulas(formulas), rotationAngle) : getPlotsFromFormulas(formulas);
  let result = "";
  sine.forEach((points, idx) => {
    const header = `ASCII Art of Sine Wave - Formula ${idx + 1}:\n`;
    const rows = 21;
    const cols = points.length;
    const gridArr = Array.from({ length: rows }, () => new Array(cols).fill(" "));

    for (let col = 0; col < cols; col++) {
      const { y } = points[col];
      const row = Math.round((1 - (y + 1) / 2) * (rows - 1));
      gridArr[row][col] = "*";
    }

    const xAxisRow = Math.round(0.5 * (rows - 1));
    for (let col = 0; col < cols; col++) {
      if (gridArr[xAxisRow][col] === " ") gridArr[xAxisRow][col] = "-";
    }
    result += header + gridArr.map((row) => row.join(" ")).join("\n") + "\n\n";
  });
  return result;
};

const plotToText = ({ formulas = [], rotationAngle = 0 } = {}) => {
  const { quadratic, linear, sine, cosine, tangent, polar, exponential, logarithmic } = (rotationAngle && rotationAngle !== 0) ? applyRotationToPlots(getPlotsFromFormulas(formulas), rotationAngle) : getPlotsFromFormulas(formulas);
  let output = "";
  output +=
    "Quadratic Plot:\n" +
    quadratic
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Linear Plot:\n" +
    linear
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Sine Plot:\n" +
    sine
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Cosine Plot:\n" +
    cosine
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Tangent Plot:\n" +
    tangent
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Polar Plot:\n" +
    polar
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Exponential Plot:\n" +
    exponential
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n\n";
  output +=
    "Logarithmic Plot:\n" +
    logarithmic
      .map(
        (points, i) =>
          `Formula ${i + 1}: ` + points.map((p) => `(${formatNumber(p.x)}, ${formatNumber(p.y)})`).join(" ")
      )
      .join("\n") +
    "\n";
  return output;
};

const plotToJson = ({ formulas = [], rotationAngle = 0 } = {}) => {
  const plots = (rotationAngle && rotationAngle !== 0) ? applyRotationToPlots(getPlotsFromFormulas(formulas), rotationAngle) : getPlotsFromFormulas(formulas);
  return plots;
};

const plotToCsv = ({ formulas = [], rotationAngle = 0 } = {}) => {
  const { quadratic, linear, sine, cosine, tangent, polar, exponential, logarithmic } = (rotationAngle && rotationAngle !== 0) ? applyRotationToPlots(getPlotsFromFormulas(formulas), rotationAngle) : getPlotsFromFormulas(formulas);
  const lines = [];
  lines.push("Plot, Formula, x, y");
  lines.push("--Quadratic Plot--");
  quadratic.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Quadratic,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Linear Plot--");
  linear.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Linear,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Sine Plot--");
  sine.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Sine,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Cosine Plot--");
  cosine.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Cosine,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Tangent Plot--");
  tangent.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Tangent,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Polar Plot--");
  polar.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Polar,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Exponential Plot--");
  exponential.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Exponential,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  lines.push("");
  lines.push("--Logarithmic Plot--");
  logarithmic.forEach((points, i) => {
    points.forEach((p) => {
      lines.push(`Logarithmic,Formula ${i + 1},${formatNumber(p.x)},${formatNumber(p.y)}`);
    });
  });
  return lines.join("");
};

const plotToFile = ({ formulas = [], outputFileName = "output.svg", type = "svg", rotationAngle = 0 } = {}) => {
  let content = "";
  if (type === "svg") {
    content = plotToSvg({ formulas, rotationAngle });
  } else if (type === "ascii") {
    content = plotToAscii({ formulas, rotationAngle });
  } else if (type === "text") {
    content = plotToText({ formulas, rotationAngle });
  } else if (type === "json") {
    content = JSON.stringify(plotToJson({ formulas, rotationAngle }), null, 2);
  } else if (type === "csv") {
    content = plotToCsv({ formulas, rotationAngle });
  } else if (type === "html") {
    content = plotToHtml({ formulas, grid: false, rotationAngle });
  } else if (type === "md") {
    content = plotToMarkdown({ formulas, rotationAngle });
  } else if (type === "png") {
    throw new Error("PNG conversion is not implemented yet.");
  } else {
    throw new Error("Unsupported type provided for plotToFile");
  }
  try {
    fs.writeFileSync(outputFileName, content, "utf8");
  } catch (e) {
    throw new Error("Error writing file: " + e.message);
  }
  return outputFileName;
};

// New: If --stats flag is used, display summary statistics of plotted data.
const printSummaryStats = (formulas) => {
  const plots = getPlotsFromFormulas(formulas);
  const stats = getPlotStats(plots);
  console.log("\nSummary Statistics:");
  console.log(JSON.stringify(stats, null, 2));
};

// Demo Test Function
const demoTest = () => {
  console.log("=== Demo Test Output ===");
  const demoPlotJson = plotToJson({ formulas: ["sine:1,1,0,0,360,30"] });
  console.log("Plot JSON output for formula 'sine:1,1,0,0,360,30':");
  console.log(JSON.stringify(demoPlotJson, null, 2));

  const demoMarkdown = plotToMarkdown({ formulas: ["y=2x+3:-10,10,1"] });
  console.log("\nPlot Markdown output for formula 'y=2x+3:-10,10,1':");
  console.log(demoMarkdown);

  const demoText = plotToText({ formulas: ["quad:1,0,0,-10,10,1"] });
  console.log("\nPlot Text output for formula 'quad:1,0,0,-10,10,1':");
  console.log(demoText);

  const demoAscii = plotToAscii({ formulas: ["sine:1,1,0,0,360,30"] });
  console.log("\nPlot ASCII art output for formula 'sine:1,1,0,0,360,30':");
  console.log(demoAscii);

  const demoCsv = plotToCsv({ formulas: ["quad:1,0,0,-10,10,1"] });
  console.log("\nPlot CSV output for formula 'quad:1,0,0,-10,10,1':");
  console.log(demoCsv);

  const demoHtml = plotToHtml({ formulas: ["y=2x+3:-10,10,1"], grid: true });
  console.log("\nPlot HTML output for formula 'y=2x+3:-10,10,1':");
  console.log(demoHtml);

  console.log("=== End Demo Test Output ===");
};

// Main Execution
const main = async () => {
  const args = process.argv.slice(2);

  const helpMessage =
    "\nUsage: node src/lib/main.js [outputFileName] [formulaStrings...] [options]\n\n" +
    "Options:\n" +
    "  --help, -h         Show this help message\n" +
    "  --json             Generate output as JSON instead of SVG\n" +
    "  --csv              Generate output as CSV instead of SVG\n" +
    "  --ascii            Generate output as ASCII art instead of SVG\n" +
    "  --md               Generate output as Markdown instead of SVG\n" +
    "  --html             Generate output as HTML\n" +
    "  --grid             Overlay grid lines on SVG plots\n" +
    "  --debug            Output internal parsed plot data for debugging\n" +
    "  --stats            Output summary statistics for plotted data\n" +
    "  --interactive      Enable interactive CLI mode for real-time user input\n" +
    "  --rotate [angle]   Rotate plot output by specified angle in degrees\n" +
    "  --version          Show version information\n\n" +
    "Formula String Formats:\n" +
    "  Quadratic: 'quad:y=x^2+2*x+1' or 'quadratic:y=x^2+2*x+1' or 'x^2+y-1=0' (or with range e.g., 'y=x^2+2*x+1:-10,10,1')\n" +
    "  Linear:    'linear:m,b[,xMin,xMax,step]' or algebraic form like 'y=2x+3' (or 'y=2x+3:-10,10,1')\n" +
    "  Sine:      'sine:amplitude,frequency,phase[,xMin,xMax,step]'\n" +
    "  Cosine:    'cosine:amplitude,frequency,phase[,xMin,xMax,step]' or 'cos:...'\n" +
    "  Tangent:   'tangent:amplitude,frequency,phase[,xMin,xMax,step]'\n" +
    "  Polar:     'polar:scale,multiplier,step[,degMin,degMax]'\n" +
    "  Exponential: 'exponential:a,b,xMin,xMax,step' or 'exp:a,b,xMin,xMax,step' or 'y=2*e^(0.5x)' (optionally with range)\n" +
    "  Logarithmic: 'log:a,base,xMin,xMax,step' or 'ln:a,base,xMin,xMax,step'";

  if (args.length === 0) {
    console.log("Usage: node src/lib/main.js [outputFileName] [formulaStrings...] [options]");
    console.log(helpMessage);
    console.log("\nNo arguments provided. Running default demo output.");
    console.log("For contribution guidelines, please refer to CONTRIBUTING.md");
    const fileContent = plotToSvg({ formulas: [] });
    const outputFileName = "output.svg";
    fs.writeFileSync(outputFileName, fileContent, "utf8");
    console.log(`SVG file generated: ${outputFileName}`);
    if (process.env.NODE_ENV !== "test") {
      process.exit(0);
    } else {
      return;
    }
  }

  if (args.includes("--version")) {
    console.log("Equation Plotter Library version 0.2.1-12");
    return;
  }

  if (args.includes("--help") || args.includes("-h")) {
    console.log(helpMessage);
    return;
  }

  let rotationAngle = 0;
  const rotateIndex = args.indexOf("--rotate");
  if (rotateIndex !== -1 && args.length > rotateIndex + 1) {
    rotationAngle = parseFloat(args[rotateIndex + 1]) || 0;
  }

  if (args.includes("--interactive")) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    await new Promise((resolve) => {
      rl.question("Enter formula strings (semicolon-separated): ", async (answer) => {
        try {
          const interactiveFormulas = answer
            .split(";")
            .map((s) => s.trim())
            .filter(Boolean);
          const filteredArgs = args.filter((arg) => arg !== "--interactive" && arg !== "--rotate" && arg !== rotationAngle.toString());
          const nonOptionArgs = filteredArgs.filter((arg) =>
            !arg.includes(":") &&
            !arg.includes("=") &&
            !["--json", "--csv", "--html", "--ascii", "--md", "--debug", "--grid", "--stats", "--interactive", "--help", "-h", "--version", "--rotate"].includes(arg)
          );
          const outputFileName = nonOptionArgs.length > 0 ? nonOptionArgs[0] : "output.svg";
          const isJson = filteredArgs.includes("--json");
          const isCsv = filteredArgs.includes("--csv");
          const isHtml = filteredArgs.includes("--html");
          let isAscii = filteredArgs.includes("--ascii");
          let isMarkdown = filteredArgs.includes("--md");
          const isDebug = filteredArgs.includes("--debug");
          const gridEnabled = filteredArgs.includes("--grid");
          const showStats = filteredArgs.includes("--stats");
          if (!isJson && !isCsv && !isHtml && !isMarkdown && !isAscii) {
            if (outputFileName.toLowerCase().endsWith(".md")) {
              isMarkdown = true;
            } else if (outputFileName.toLowerCase().endsWith(".txt")) {
              isAscii = true;
            }
          }
          if (isDebug) {
            console.log("\nDebug: Internal parsed plot data:");
            console.log(JSON.stringify(getPlotsFromFormulas(interactiveFormulas), null, 2));
          }
          let fileContent = "";
          if (isJson) {
            fileContent = JSON.stringify(plotToJson({ formulas: interactiveFormulas, rotationAngle }), null, 2);
          } else if (isCsv) {
            fileContent = plotToCsv({ formulas: interactiveFormulas, rotationAngle });
          } else if (isHtml) {
            fileContent = plotToHtml({ formulas: interactiveFormulas, grid: gridEnabled, rotationAngle });
          } else if (isMarkdown) {
            fileContent = plotToMarkdown({ formulas: interactiveFormulas, rotationAngle });
          } else if (isAscii) {
            fileContent = plotToAscii({ formulas: interactiveFormulas, rotationAngle });
          } else {
            fileContent = plotToSvg({ formulas: interactiveFormulas, grid: gridEnabled, rotationAngle });
          }
          try {
            fs.writeFileSync(outputFileName, fileContent, "utf8");
            console.log(`\nFile generated: ${outputFileName}`);
          } catch (_) {
            console.error(`Error writing file`);
            resolve();
            return;
          }
          if (showStats) {
            printSummaryStats(interactiveFormulas);
          }
          console.log("\nText Representation of Plots:");
          console.log(plotToText({ formulas: interactiveFormulas, rotationAngle }));
        } catch (err) {
          console.error("Error during interactive mode:", err);
        } finally {
          rl.close();
          resolve();
        }
      });
    });
    return;
  }

  const nonOptionArgs = args.filter((arg) =>
    !arg.includes(":") &&
    !arg.includes("=") &&
    !["--json", "--csv", "--html", "--ascii", "--md", "--debug", "--grid", "--stats", "--interactive", "--help", "-h", "--version", "--rotate"].includes(arg)
  );
  const outputFileName = nonOptionArgs.length > 0 ? nonOptionArgs[0] : "output.svg";
  const isJson = args.includes("--json");
  const isCsv = args.includes("--csv");
  const isHtml = args.includes("--html");
  let isAscii = args.includes("--ascii");
  let isMarkdown = args.includes("--md");
  const isDebug = args.includes("--debug");
  const gridEnabled = args.includes("--grid");
  const showStats = args.includes("--stats");

  if (!isJson && !isCsv && !isHtml && !isMarkdown && !isAscii) {
    if (outputFileName.toLowerCase().endsWith(".md")) {
      isMarkdown = true;
    } else if (outputFileName.toLowerCase().endsWith(".txt")) {
      isAscii = true;
    }
  }

  const formulasList = args.filter((arg) => arg.includes(":") || arg.includes("="));

  if (formulasList.length === 0) {
    console.log(
      "No formulas provided. Using default plot functions for quadratic, linear, sine, cosine, tangent, polar, exponential, and logarithmic plots."
    );
  }

  if (isDebug) {
    console.log("\nDebug: Internal parsed plot data:");
    console.log(JSON.stringify(getPlotsFromFormulas(formulasList), null, 2));
  }

  let fileContent = "";
  if (isJson) {
    fileContent = JSON.stringify(plotToJson({ formulas: formulasList, rotationAngle }), null, 2);
  } else if (isCsv) {
    fileContent = plotToCsv({ formulas: formulasList, rotationAngle });
  } else if (isHtml) {
    fileContent = plotToHtml({ formulas: formulasList, grid: gridEnabled, rotationAngle });
  } else if (isMarkdown) {
    fileContent = plotToMarkdown({ formulas: formulasList, rotationAngle });
  } else if (isAscii) {
    fileContent = plotToAscii({ formulas: formulasList, rotationAngle });
  } else {
    fileContent = plotToSvg({ formulas: formulasList, grid: gridEnabled, rotationAngle });
  }

  try {
    fs.writeFileSync(outputFileName, fileContent, "utf8");
  } catch (_) {
    console.error(`Error writing file`);
    return;
  }

  let outputType = "SVG";
  if (isJson) outputType = "JSON";
  else if (isCsv) outputType = "CSV";
  else if (isHtml) outputType = "HTML";
  else if (isMarkdown) outputType = "Markdown";
  else if (isAscii) outputType = "ASCII";
  console.log(`\n${outputType} file generated: ${outputFileName}`);

  if (showStats) {
    printSummaryStats(formulasList);
  }

  console.log("\nText Representation of Plots:");
  console.log(plotToText({ formulas: formulasList, rotationAngle }));

  return;
};

if (process.argv[1] === fileURLToPath(import.meta.url) && !process.env.VITEST_WORKER_ID) {
  (async () => {
    try {
      await main();
    } catch (err) {
      console.error(err);
      if (process.env.NODE_ENV === "test") {
        throw err;
      }
      process.exit(1);
    }
  })();
}

export {
  plotToSvg,
  plotToAscii,
  plotToText,
  plotToJson,
  plotToCsv,
  plotToHtml,
  plotToMarkdown,
  plotToFile,
  plotToPng,
  plotFromString,
  plotQuadratic,
  plotSine,
  plotCosine,
  plotTangent,
  plotPolar,
  plotLinear,
  plotExponential,
  plotLogarithmic,
  parseGenericQuadratic,
  parseGenericExponential,
  parseCosine,
  main,
  demoTest,
  getPlotStats,
  getPlotsFromFormulas,
  queryPlotData,
  advancedQueryPlotData,
  computeCentroid,
  computeBoundingBox
};
