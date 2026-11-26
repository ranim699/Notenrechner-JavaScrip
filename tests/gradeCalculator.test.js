// Run with: npm test   (or: node tests/gradeCalculator.test.js)
const assert = require("assert");
const g = require("../public/js/gradeCalculator.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log("✓ " + name);
}

test("only the first decimal counts, no rounding", () => {
  assert.strictEqual(g.truncateToOneDecimal(2.38), 2.3);
  assert.strictEqual(g.truncateToOneDecimal(1.99), 1.9);
  assert.strictEqual(g.truncateToOneDecimal(2.3), 2.3);
});

test("4.0 passes, 5.0 fails", () => {
  assert.strictEqual(g.isPassed(4.0), true);
  assert.strictEqual(g.isPassed(5.0), false);
  assert.strictEqual(g.isPassed(null), false);
});

test("average is weighted by credit points", () => {
  // (5 * 1.0 + 2.5 * 4.0) / 7.5 = 2.0
  const r = g.weightedAverage([{ cp: 5, grade: 1.0 }, { cp: 2.5, grade: 4.0 }]);
  assert.strictEqual(r.average, 2.0);
  assert.strictEqual(r.gradedCp, 7.5);
});

test("failed modules are not part of the average", () => {
  const r = g.weightedAverage([{ cp: 5, grade: 1.7 }, { cp: 5, grade: 5.0 }]);
  assert.strictEqual(r.average, 1.7);
});

test("average is cut off, not rounded", () => {
  // (1.7 + 2.0 + 2.0) / 3 = 1.9
  const r = g.weightedAverage([{ cp: 5, grade: 1.7 }, { cp: 5, grade: 2.0 }, { cp: 5, grade: 2.0 }]);
  assert.strictEqual(r.average, 1.9);
});

test("thesis 80 % and colloquium 20 %", () => {
  assert.strictEqual(g.thesisGrade(1.7, 1.0), 1.5);   // 1.36 + 0.2 = 1.56 -> 1.5
  assert.strictEqual(g.thesisGrade(2.3, null), null);
});

test("grade bands", () => {
  assert.ok(g.gradeBand(1.5).startsWith("very good"));
  assert.ok(g.gradeBand(1.6).startsWith("good"));
  assert.ok(g.gradeBand(2.5).startsWith("good"));
  assert.ok(g.gradeBand(3.5).startsWith("satisfactory"));
  assert.ok(g.gradeBand(4.0).startsWith("sufficient"));
});

test("required average for a target grade", () => {
  // 10 CP with 2.0 done, 10 CP open, target 2.0 -> exact average must stay below 2.1
  const needed = g.requiredAverage(20, 10, 10, 2.0);
  assert.ok(Math.abs(needed - 2.2) < 1e-9);
});

console.log(`\n${passed} tests passed`);
