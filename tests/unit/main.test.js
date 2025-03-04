/* eslint-disable no-unused-vars */
/* global describe, test, expect, vi */
// File: tests/unit/main.test.js

import { describe, test, expect, vi } from 'vitest';
import * as mainModule from '@src/lib/main.js';
import fs from 'fs';
import readline from 'readline';

describe('Main Module Import', () => {
  test('should be non-null', () => {
    expect(mainModule).not.toBeNull();
  });
});

describe('Exported API Functions', () => {
  test('plotToSvg returns string containing <svg>', () => {
    const svg = mainModule.plotToSvg({ formulas: ['quad:1,0,0,-10,10,1'] });
    expect(typeof svg).toBe('string');
    expect(svg).toContain('<svg');
  });

  test('plotToJson returns object with required keys', () => {
    const json = mainModule.plotToJson({ formulas: ['sine:1,1,0,0,360,30'] });
    expect(json).toHaveProperty('quadratic');
    expect(json).toHaveProperty('linear');
    expect(json).toHaveProperty('sine');
    expect(json).toHaveProperty('cosine');
    expect(json).toHaveProperty('tangent');
    expect(json).toHaveProperty('polar');
    expect(json).toHaveProperty('exponential');
    expect(json).toHaveProperty('logarithmic');
  });

  test('plotToText returns non-empty string', () => {
    const text = mainModule.plotToText({ formulas: ['y=2x+3:-10,10,1'] });
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
  });

  test('plotToCsv returns CSV formatted string', () => {
    const csv = mainModule.plotToCsv({ formulas: ['quad:1,0,0,-10,10,1'] });
    expect(csv).toContain(',');
    expect(csv).toContain('Quadratic');
  });

  test('plotToHtml returns HTML string', () => {
    const html = mainModule.plotToHtml({ formulas: ['y=2x+3:-10,10,1'], grid: true });
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('<div>');
  });

  test('plotToMarkdown returns markdown formatted string', () => {
    const md = mainModule.plotToMarkdown({ formulas: ['sine:1,1,0,0,360,30'] });
    expect(md).toContain('# Plot Data');
  });

  test('main generates markdown file when output file ends with .md', async () => {
    const writeFileSyncSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
    const originalArgv = process.argv;
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'src/lib/main.js', 'output.md', 'y=2x+3:-10,10,1'];
    if (mainModule.main) {
      await mainModule.main();
    }
    const argsCall = writeFileSyncSpy.mock.calls[0];
    expect(argsCall[1]).toContain('# Plot Data');
    writeFileSyncSpy.mockRestore();
    process.argv = originalArgv;
    process.env.NODE_ENV = originalEnv;
  });

  test('Interactive CLI Mode prompts for input', async () => {
    const rlMock = {
      question: vi.fn((prompt, callback) => {
        callback('y=2x+3:-10,10,1');
      }),
      close: vi.fn()
    };
    vi.spyOn(readline, 'createInterface').mockReturnValue(rlMock);
    const originalArgv = process.argv;
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    process.argv = ['node', 'src/lib/main.js', '--interactive'];
    await mainModule.main();
    expect(rlMock.question).toHaveBeenCalled();
    process.argv = originalArgv;
    process.env.NODE_ENV = originalEnv;
  }, 6000);

  test('plotToAscii returns ASCII art string', () => {
    const ascii = mainModule.plotToAscii({ formulas: ['sine:1,1,0,0,360,30'] });
    expect(typeof ascii).toBe('string');
    expect(ascii).toContain('ASCII Art of Sine Wave');
  });

  test('plotToFile writes a file and returns file name', () => {
    const fileName = 'test_output.svg';
    const result = mainModule.plotToFile({ formulas: ['quad:1,0,0,-10,10,1'], outputFileName: fileName, type: 'svg' });
    expect(result).toBe(fileName);
  });

  test('plotFromString returns empty array for unrecognized formula', () => {
    const result = mainModule.plotFromString('unknown:parameter');
    expect(result).toEqual([]);
  });

  // New Test for Tangent Plot functionality
  test('plotTangent returns valid tangent plot points', () => {
    const tangentPoints = mainModule.plotTangent();
    expect(Array.isArray(tangentPoints)).toBe(true);
    expect(tangentPoints.length).toBeGreaterThan(0);
    tangentPoints.forEach((point) => {
      expect(point.x).toBeGreaterThanOrEqual(-45);
      expect(point.x).toBeLessThanOrEqual(45);
    });
  });

  // New Test for Summary Statistics feature
  test('getPlotStats returns valid summary object', () => {
    const plots = mainModule.getPlotsFromFormulas(['quad:1,0,0,-10,10,1', 'sine:1,1,0,0,360,30']);
    const stats = mainModule.getPlotStats(plots);
    expect(stats).toHaveProperty('quadratic');
    expect(stats.quadratic).toHaveProperty('count');
    expect(typeof stats.quadratic.count).toBe('number');
    expect(stats).toHaveProperty('sine');
    expect(stats.sine).toHaveProperty('minX');
  });

  // New Test for Rotation Feature
  test('Rotation flag rotates plot points', () => {
    const originalJson = mainModule.plotToJson({ formulas: ['quad:1,0,0,-10,10,1'] });
    const rotatedJson = mainModule.plotToJson({ formulas: ['quad:1,0,0,-10,10,1'], rotationAngle: 90 });
    const originalPoint = originalJson.quadratic[0][0];
    const rotatedPoint = rotatedJson.quadratic[0][0];
    expect(rotatedPoint.x).toBeCloseTo(-originalPoint.y, 1);
    expect(rotatedPoint.y).toBeCloseTo(originalPoint.x, 1);
  });

  // New Test for Advanced Query Plot Data Feature
  test('advancedQueryPlotData filters plot data based on x and y predicates', () => {
    const plots = mainModule.getPlotsFromFormulas(['quad:1,0,0,-10,10,1']);
    const filtered = mainModule.advancedQueryPlotData(plots, { x: (val) => val >= 0, y: (val) => val <= 50 });
    filtered.quadratic.forEach(points => {
      points.forEach(point => {
        expect(point.x).toBeGreaterThanOrEqual(0);
        expect(point.y).toBeLessThanOrEqual(50);
      });
    });
  });

  // New Tests for Geometric Computation Functions
  test('computeCentroid calculates correct centroid', () => {
    const points = [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 0 }];
    const centroid = mainModule.computeCentroid(points);
    expect(centroid.x).toBeCloseTo(2);
    expect(centroid.y).toBeCloseTo(0.67, 1);
  });

  test('computeBoundingBox calculates correct bounding box', () => {
    const points = [{ x: 0, y: 0 }, { x: 2, y: 2 }, { x: 4, y: 0 }];
    const bbox = mainModule.computeBoundingBox(points);
    expect(bbox.minX).toBe(0);
    expect(bbox.maxX).toBe(4);
    expect(bbox.minY).toBe(0);
    expect(bbox.maxY).toBe(2);
  });

  // New Test for README content reflecting updated documentation
  test('README file contains updated documentation references', () => {
    const readmeContent = fs.readFileSync('README.md', 'utf8');
    expect(readmeContent).toContain('Equation Plotter CLI');
    expect(readmeContent).toContain('[CONTRIBUTING.md]');
    expect(readmeContent).toContain('Be a go-to plot library with a CLI');
  });

  describe('Error Handling', () => {
    test('parseGenericQuadratic throws error for invalid input', () => {
      expect(() => mainModule.parseGenericQuadratic('invalid formula')).toThrow();
    });

    test('parseSine throws error for invalid sine formula string', () => {
      expect(() => mainModule.parseSine('sine:invalid')).toThrow();
    });

    test('plotToPng throws not implemented error', () => {
      expect(() => mainModule.plotToPng({ formulas: ['quad:1,0,0,-10,10,1'] })).toThrow(
        'PNG conversion is not implemented yet.'
      );
    });

    // New Test: plotToFile error handling when fs.writeFileSync fails
    test('plotToFile throws error when file writing fails', () => {
      const fsSpy = vi.spyOn(fs, 'writeFileSync').mockImplementation(() => { throw new Error('Mock write error'); });
      expect(() => {
        mainModule.plotToFile({ formulas: ['quad:1,0,0,-10,10,1'], outputFileName: 'fail.svg', type: 'svg' });
      }).toThrow('Error writing file: Mock write error');
      fsSpy.mockRestore();
    });
  });
});
