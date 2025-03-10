// tests/unit/main.test.js
// Updated tests with enhanced mocks for external dependencies and refined error handling for improved coverage.
import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as mainModule from '@src/lib/main.js';

const {
  main,
  loadExpress,
  loadReadline,
  overrides,
  plotQuadratic,
  generateRange,
  calculateDerivative,
  plotSineReal,
  plotCosineReal,
  plotExponentialReal,
  plotLogarithmicReal,
  plotQuadraticReal,
  plotLinearReal,
  plotTangentReal,
  rotatePointsReal,
  plotSigmoidReal,
  plotReLUReal,
  plotHistogramReal,
  plotPolarReal,
  plotLogisticReal,
  movingAverageReal,
  plotSincReal,
  calculateDefiniteIntegralReal,
  plotBezierReal,
  plotHyperbolaReal,
  plotEllipseReal,
  plotCubicReal,
  movingMedianReal,
  plotGaussianReal,
  plotHeatMapReal,
  plotScatterReal,
  plotBarChartReal,
  plotLissajousReal,
  plotCustomReal,
  plotSinCosCombinedReal,
  fibonacciSequence,
  plotFibonacciSpiralReal,
  plotCircularPlotReal,
  plotPolarRoseReal,
  plotStarPolygonReal,
  plotBesselReal,
  resetOverrides
} = mainModule;

beforeEach(() => {
  resetOverrides();
});

// Removed local resetOverrides since resetOverrides is now exported from mainModule

describe('Main Function Behaviour', () => {
  test('should output demo message when no arguments are provided', () => {
    const spy = vi.spyOn(console, 'log');
    main([]);
    expect(spy).toHaveBeenCalledWith(
      "Welcome to repository0-plot-code-lib CLI!\nMission: 'Be a go-to plot library with a CLI, be the jq of formulae visualisations.'\nSelect from modes: --interactive, --serve, --diagnostics, --plot-abs, --export-csv, --export-md, --export-json, --export-html, --export-ascii, --export-svg, --export-xml, --export-latex, --export-txt, --export-r, --export-png, --plot-fibonacci, --bar-chart, --scatter, --plot-parametric, --plot-poly, --lissajous, --lemniscate, --hyperbola, --power-plot, --plot-histogram, --heatmap, --plot-spiral, --plot-custom, --plot-sincos, --plot-circle, --plot-polarrose, --plot-starpolygon, --plot-bessel or provide plot parameters.\nFor contribution guidelines, please refer to CONTRIBUTING.md."
    );
    spy.mockRestore();
  });

  test('should output help message when --help flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--help']);
    expect(spy).toHaveBeenCalledWith(
      "Welcome to repository0-plot-code-lib CLI!\nMission: 'Be a go-to plot library with a CLI, be the jq of formulae visualisations.'\nSelect from modes: --interactive, --serve, --diagnostics, --plot-abs, --export-csv, --export-md, --export-json, --export-html, --export-ascii, --export-svg, --export-xml, --export-latex, --export-txt, --export-r, --export-png, --plot-fibonacci, --bar-chart, --scatter, --plot-parametric, --plot-poly, --lissajous, --lemniscate, --hyperbola, --power-plot, --plot-histogram, --heatmap, --plot-spiral, --plot-custom, --plot-sincos, --plot-circle, --plot-polarrose, --plot-starpolygon, --plot-bessel or provide plot parameters.\nFor contribution guidelines, please refer to CONTRIBUTING.md."
    );
    spy.mockRestore();
  });

  test('should output diagnostics when --diagnostics flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--diagnostics']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Diagnostics: Node version:'));
    spy.mockRestore();
  });

  test('should process plot request when plot parameters are provided', () => {
    const spy = vi.spyOn(console, 'log');
    const args = ['plot.svg', 'quad:1,0,0,-10,10,1'];
    main(args);
    expect(spy).toHaveBeenCalledWith(`Processing plot request with parameters: ${JSON.stringify(args)}`);
    spy.mockRestore();
  });

  test('should prompt for user input when --interactive flag is provided (test environment)', async () => {
    const spy = vi.spyOn(console, 'log');
    const originalVitest = process.env.VITEST;
    process.env.VITEST = 'true';

    const fakeInterface = {
      question: (_prompt, callback) => {
        callback('simulated plot command');
      },
      close: vi.fn()
    };
    const fakeReadlineModule = {
      createInterface: () => fakeInterface
    };

    overrides.loadReadlineOverride = () => Promise.resolve(fakeReadlineModule);

    await main(['--interactive']);
    expect(spy).toHaveBeenCalledWith('Received plot command: simulated plot command');
    spy.mockRestore();
    process.env.VITEST = originalVitest;
    resetOverrides();
  }, 6000);

  test('should trigger fallback timeout in interactive mode when no answer is provided (non-test environment)', async () => {
    process.env.NODE_ENV = 'non-test';
    process.env.VITEST = undefined;
    const spyWarn = vi.spyOn(console, 'warn');

    const fakeInterface = {
      question: (_prompt, _callback) => {},
      close: vi.fn()
    };
    const fakeReadlineModule = {
      createInterface: () => fakeInterface
    };
    overrides.loadReadlineOverride = () => Promise.resolve(fakeReadlineModule);

    vi.useFakeTimers();
    const promise = main(['--interactive']);
    await vi.advanceTimersByTimeAsync(120);
    await promise;
    expect(spyWarn).toHaveBeenCalledWith('Interactive mode fallback triggered after timeout');
    spyWarn.mockRestore();
    vi.useRealTimers();
    process.env.NODE_ENV = 'test';
    process.env.VITEST = 'true';
    resetOverrides();
  });

  test('should start Express server when --serve flag is provided', async () => {
    const spy = vi.spyOn(console, 'log');
    const fakeExpress = () => {
      return {
        get: (path, cb) => {},
        listen: (port, cb) => {
          cb();
          return { close: () => {} };
        }
      };
    };
    overrides.loadExpressOverride = () => Promise.resolve({ default: fakeExpress });

    process.env.VITEST = 'true';
    await main(['--serve']);
    expect(spy).toHaveBeenCalledWith(`Express server running at http://localhost:3000`);
    spy.mockRestore();
    resetOverrides();
  });

  test('should catch error and print error message when express fails in --serve mode', async () => {
    const spy = vi.spyOn(console, 'error');
    process.env.VITEST = '';
    overrides.loadExpressOverride = () => Promise.reject(new Error('express failure'));
    await main(['--serve']);
    expect(spy).toHaveBeenCalledWith('Error starting server:', expect.any(Error));
    spy.mockRestore();
    resetOverrides();
  });

  test('should output absolute plot when --plot-abs flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-abs']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Plot Absolute of sin(x):'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output CSV plot when --export-csv flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-csv']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('CSV Output:'), expect.any(String));
    spy.mockRestore();
  });

  test('should output Markdown plot when --export-md flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-md']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Markdown Output:'), expect.any(String));
    spy.mockRestore();
  });

  test('should output JSON plot when --export-json flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-json']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('JSON Output:'), expect.any(String));
    spy.mockRestore();
  });

  test('should output HTML plot when --export-html flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-html']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('HTML Output:'));
    spy.mockRestore();
  });

  test('should output ASCII plot when --export-ascii flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-ascii']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('ASCII Output:'));
    spy.mockRestore();
  });

  test('should output SVG plot when --export-svg flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-svg']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('SVG Output:'));
    spy.mockRestore();
  });

  test('should output XML plot when --export-xml flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-xml']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('XML Output:'));
    spy.mockRestore();
  });

  test('should output LaTeX plot when --export-latex flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-latex']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('LaTeX Output:'), expect.any(String));
    spy.mockRestore();
  });

  test('should output TXT plot when --export-txt flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-txt']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('TXT Output:'), expect.any(String));
    spy.mockRestore();
  });

  test('should output R plot when --export-r flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-r']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('R Output:'), expect.any(String));
    spy.mockRestore();
  });

  test('should output PNG plot when --export-png flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--export-png']);
    expect(spy).toHaveBeenCalledWith('PNG Output: [stub output for PNG]');
    spy.mockRestore();
  });

  test('should output Fibonacci Spiral plot when --plot-fibonacci flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-fibonacci']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Fibonacci Spiral Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Custom Plot when --plot-custom flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-custom']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Custom Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output SinCos Combined Plot when --plot-sincos flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-sincos']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('SinCos Combined Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Scatter plot when --scatter flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--scatter']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Scatter Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Bar Chart when --bar-chart flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--bar-chart']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Bar Chart Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Parametric plot when --plot-parametric flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-parametric']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Parametric Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Polynomial plot when --plot-poly flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-poly']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Polynomial Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Lissajous plot when --lissajous flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--lissajous']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Lissajous Curve Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Lemniscate plot when --lemniscate flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--lemniscate']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Lemniscate Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Power Plot when --power-plot flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--power-plot']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Power Plot (y = 2x^3) Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Histogram plot when --plot-histogram flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-histogram']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Histogram Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Heat Map plot when --heatmap flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--heatmap']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Heat Map Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Spiral plot when --plot-spiral flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-spiral']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Spiral Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Circular plot when --plot-circle flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-circle']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Circular Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Polar Rose plot when --plot-polarrose flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-polarrose']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Polar Rose Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Star Polygon plot when --plot-starpolygon flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-starpolygon']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Star Polygon Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should output Bessel plot when --plot-bessel flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--plot-bessel']);
    expect(spy).toHaveBeenCalledWith(expect.stringContaining('Bessel Plot Output:'), expect.any(Array));
    spy.mockRestore();
  });

  test('should handle unrecognized flag gracefully', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--unknown']);
    expect(spy).toHaveBeenCalledWith(`Processing plot request with parameters: ${JSON.stringify(['--unknown'])}`);
    spy.mockRestore();
  });

  // New Extended Function Implementations Tests
  describe('New Extended Functions', () => {
    test('fibonacciSequence returns correct Fibonacci numbers', () => {
      const result = fibonacciSequence(7);
      expect(result).toEqual([1, 1, 2, 3, 5, 8, 13]);
    });

    test('plotFibonacciSpiralReal returns array of points with length equal to steps', () => {
      const result = plotFibonacciSpiralReal(5, 0.2);
      expect(result).toHaveLength(5);
      result.forEach(point => {
        expect(point).toHaveProperty('theta');
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });
    });

    test('plotSinCosCombinedReal returns correct combined sine and cosine values', () => {
      const result = plotSinCosCombinedReal(0, Math.PI, Math.PI/2);
      expect(result).toEqual([
        { x: 0, sin: 0, cos: 1 },
        { x: Math.PI/2, sin: 1, cos: 0 },
        { x: Math.PI, sin: 0, cos: -1 }
      ]);
    });

    test('plotCircularPlotReal returns correct number of circle points', () => {
      const steps = 36;
      const result = plotCircularPlotReal({ x: 0, y: 0 }, 5, steps);
      expect(result).toHaveLength(steps);
      result.forEach(point => {
        expect(point).toHaveProperty('theta');
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });
    });

    test('plotPolarRoseReal returns an array of points covering 2π range', () => {
      const result = plotPolarRoseReal(4, 5, 0.2);
      expect(result[0]).toHaveProperty('theta');
      expect(result[result.length - 1].theta).toBeGreaterThanOrEqual(2 * Math.PI - 0.2);
    });

    test('plotStarPolygonReal returns correct number of points', () => {
      const numPoints = 5;
      const result = plotStarPolygonReal({ x: 0, y: 0 }, 5, 2.5, numPoints);
      expect(result).toHaveLength(numPoints * 2);
      result.forEach(point => {
        expect(point).toHaveProperty('theta');
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });
    });

    test('plotBesselReal returns an array of points with computed Bessel values', () => {
      const result = plotBesselReal(0, 5, 0.5, 0);
      expect(result.length).toBeGreaterThan(0);
      result.forEach(point => {
        expect(point).toHaveProperty('theta');
        expect(point).toHaveProperty('x');
        expect(point).toHaveProperty('y');
      });
    });
  });
});

describe('Debug flag behaviour', () => {
  test('should output debug message when --debug flag is provided', () => {
    const spy = vi.spyOn(console, 'log');
    main(['--debug']);
    const debugString = spy.mock.calls.map(call => call[0]).join(' ');
    expect(debugString).toContain('plotQuadratic');
    expect(debugString).toContain('plotCustomReal');
    expect(debugString).toContain('exportPlotAsXML');
    expect(debugString).toContain('exportPlotAsLaTeX');
    expect(debugString).toContain('exportPlotAsTXT');
    expect(debugString).toContain('plotPolynomial');
    expect(debugString).toContain('plotModulatedSine');
    expect(debugString).toContain('plotSpiralReal');
    expect(debugString).toContain('plotSpiral');
    expect(debugString).toContain('plotBezierReal');
    expect(debugString).toContain('plotPolarReal');
    expect(debugString).toContain('plotLogisticReal');
    expect(debugString).toContain('movingAverageReal');
    expect(debugString).toContain('plotHistogramReal');
    expect(debugString).toContain('plotHyperbolaReal');
    expect(debugString).toContain('plotEllipseReal');
    expect(debugString).toContain('plotCubicReal');
    expect(debugString).toContain('movingMedianReal');
    expect(debugString).toContain('plotGaussianReal');
    expect(debugString).toContain('plotScatterReal');
    expect(debugString).toContain('plotBarChartReal');
    expect(debugString).toContain('plotLissajousReal');
    expect(debugString).toContain('plotCustomReal');
    expect(debugString).toContain('plotSinCosCombinedReal');
    expect(debugString).toContain('plotCircularPlotReal');
    expect(debugString).toContain('plotPolarRoseReal');
    expect(debugString).toContain('plotStarPolygonReal');
    expect(debugString).toContain('plotBesselReal');
    spy.mockRestore();
  });
});

describe('Module Loading Helpers', () => {
  test('loadExpress should return a promise that resolves to a module', async () => {
    const mod = await loadExpress();
    expect(mod).toBeDefined();
  });

  test('loadReadline should return a promise that resolves to a module', async () => {
    const mod = await loadReadline();
    expect(mod).toBeDefined();
  });
});

describe('Error Handling for module loaders', () => {
  test('loadReadline should handle failure gracefully', async () => {
    overrides.loadReadlineOverride = () => Promise.reject(new Error('readline failure'));
    const spyError = vi.spyOn(console, 'error');
    await main(['--interactive']);
    expect(spyError).toHaveBeenCalledWith('Error loading readline module:', expect.any(Error));
    spyError.mockRestore();
    resetOverrides();
  });

  test('loadExpress should handle failure gracefully', async () => {
    overrides.loadExpressOverride = () => Promise.reject(new Error('express failure'));
    const spyError = vi.spyOn(console, 'error');
    process.env.VITEST = '';
    await main(['--serve']);
    expect(spyError).toHaveBeenCalledWith('Error starting server:', expect.any(Error));
    spyError.mockRestore();
    resetOverrides();
  });
});

describe('Stub Function Tests', () => {
  test('plotQuadratic stub should log its message', () => {
    const spy = vi.spyOn(console, 'log');
    plotQuadratic();
    expect(spy).toHaveBeenCalledWith('plotQuadratic stub executed');
    spy.mockRestore();
  });
});
