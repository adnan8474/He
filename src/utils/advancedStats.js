/**
 * ---------------------------------------------------------------------------
 * Advanced Statistical Utilities
 * ---------------------------------------------------------------------------
 *
 * This module gathers a collection of helper functions that go beyond the basic
 * statistics required for POCTify's core functionality. They are intentionally
 * verbose and well-documented so that new contributors can easily understand
 * the algorithms and adapt them for their own needs. None of these functions
 * are currently invoked directly by the user interface, but they demonstrate
 * how more specialised quality control rules and regression techniques might be
 * implemented in future versions of the application.
 *
 * The design philosophy here is to keep every computation explicit, avoiding
 * external dependencies where possible so the code can be read like a textbook.
 * Extensive comments describe each step to assist learners who may not have a
 * strong programming or mathematics background.
 */

/**
 * Calculate Pearson's correlation coefficient between two numeric arrays.
 * This gives a measure of the linear association between paired values.
 */
export function pearsonCorrelation(xs, ys) {
  if (xs.length !== ys.length) {
    throw new Error('Arrays must be the same length');
  }
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let denX = 0;
  let denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }
  return num / Math.sqrt(denX * denY);
}

/**
 * Compute the coefficient of determination (R^2) from a paired dataset. This
 * value indicates how much of the variation in Y is explained by X.
 */
export function rSquared(xs, ys) {
  const r = pearsonCorrelation(xs, ys);
  return r * r;
}

/**
 * Perform linear regression using the least squares method. The returned object
 * contains the slope and intercept of the regression line along with helper
 * functions to generate predictions.
 */
export function linearRegression(xs, ys) {
  const n = xs.length;
  if (n !== ys.length) {
    throw new Error('Input arrays must have the same length');
  }
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let numerator = 0;
  let denominator = 0;
  for (let i = 0; i < n; i++) {
    numerator += (xs[i] - meanX) * (ys[i] - meanY);
    denominator += Math.pow(xs[i] - meanX, 2);
  }
  const slope = numerator / denominator;
  const intercept = meanY - slope * meanX;

  return {
    slope,
    intercept,
    predict(x) {
      return intercept + slope * x;
    }
  };
}

/**
 * Calculate the mean absolute deviation of an array of numbers. This is a
 * robust measure of dispersion that is less sensitive to outliers compared to
 * the standard deviation.
 */
export function meanAbsoluteDeviation(values) {
  if (!values.length) return NaN;
  const m = values.reduce((a, b) => a + b, 0) / values.length;
  const sum = values.reduce((acc, v) => acc + Math.abs(v - m), 0);
  return sum / values.length;
}

/**
 * Generate a Bland-Altman statistics object from two arrays of measurements.
 * This is similar to `summarizePair` in `stats.js` but accepts raw arrays
 * instead of a pre-structured dataset. The function demonstrates how the core
 * analysis works internally.
 */
export function blandAltmanFromArrays(a, b) {
  if (a.length !== b.length) {
    throw new Error('Arrays must have the same length');
  }
  const diffs = [];
  const means = [];
  for (let i = 0; i < a.length; i++) {
    diffs.push(a[i] - b[i]);
    means.push((a[i] + b[i]) / 2);
  }
  const bias = diffs.reduce((p, c) => p + c, 0) / diffs.length;
  const sd = Math.sqrt(
    diffs.map(x => Math.pow(x - bias, 2)).reduce((p, c) => p + c, 0) / diffs.length
  );
  const loa = 1.96 * sd;
  return {
    bias,
    sd,
    loaLower: bias - loa,
    loaUpper: bias + loa,
    means,
    diffs
  };
}

/**
 * Compute the moving average of a numeric array. The window size defaults to 3
 * but can be customised. The function pads the result so that the output array
 * matches the input length.
 */
export function movingAverage(arr, window = 3) {
  if (window <= 0) throw new Error('window must be > 0');
  const result = [];
  for (let i = 0; i < arr.length; i++) {
    let start = Math.max(0, i - Math.floor(window / 2));
    let end = Math.min(arr.length, i + Math.ceil(window / 2));
    const slice = arr.slice(start, end);
    const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
    result.push(avg);
  }
  return result;
}

/**
 * Placeholder for future quality control rules (e.g. Westgard). Each rule
 * function returns true when a violation is detected. Implementations are
 * simplified for illustration.
 */
export const qcRules = {
  /**
   * 1_2s rule: one control result exceeds the mean by more than 2 SD.
   */
  rule_1_2s(values, mean, sd) {
    return values.some(v => Math.abs(v - mean) > 2 * sd);
  },
  /**
   * R_4s rule: difference between two consecutive control results exceeds 4 SD.
   */
  rule_R_4s(values, mean, sd) {
    for (let i = 1; i < values.length; i++) {
      if (Math.abs(values[i] - values[i-1]) > 4 * sd) return true;
    }
    return false;
  }
};

/**
 * Example function demonstrating how these advanced utilities might be chained
 * together for a more comprehensive QC workflow.
 */
export function evaluateQuality(values) {
  const meanVal = values.reduce((a,b) => a + b, 0) / values.length;
  const sdVal = Math.sqrt(values.map(v => Math.pow(v - meanVal, 2)).reduce((a,b) => a+b, 0) / values.length);
  return {
    mean: meanVal,
    sd: sdVal,
    mad: meanAbsoluteDeviation(values),
    qcViolations: {
      '1_2s': qcRules.rule_1_2s(values, meanVal, sdVal),
      'R_4s': qcRules.rule_R_4s(values, meanVal, sdVal)
    }
  };
}
