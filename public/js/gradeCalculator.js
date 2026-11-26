// ==========================================================
// German grading rules of FH Dortmund – pure functions, no HTML.
//
// Rules (Rahmenprüfungsordnung FH Dortmund = RahmenPO,
//        Studiengangsprüfungsordnung Wirtschaftsinformatik = StgPO):
//  - Allowed grades: 1.0 1.3 1.7 2.0 2.3 2.7 3.0 3.3 3.7 4.0 5.0
//    (RahmenPO § 9 (2): 0.7, 4.3, 4.7 and 5.3 are not allowed)
//  - A module is passed with 4.0 or better (RahmenPO § 20 (4))
//  - Averages are weighted by credit points (StgPO § 35, RahmenPO § 9 (5))
//  - Only the first decimal counts, further decimals are cut off
//    WITHOUT rounding (RahmenPO § 9 (6))
//  - Ungraded modules do not count for the final grade (StgPO Anlage 1)
//  - Thesis and colloquium are weighted 80 : 20 (StgPO § 33 (2))
//  - Grade bands (RahmenPO § 9 (6)): up to 1.5 very good, over 1.5 up to
//    2.5 good, over 2.5 up to 3.5 satisfactory, over 3.5 up to 4.0
//    sufficient, over 4.0 not sufficient
// ==========================================================

const GRADES = [1.0, 1.3, 1.7, 2.0, 2.3, 2.7, 3.0, 3.3, 3.7, 4.0, 5.0];
const PASS_LIMIT = 4.0;

// Keep only the first decimal, no rounding: 2.38 -> 2.3, 1.99 -> 1.9
function truncateToOneDecimal(value) {
  // the small epsilon protects against floating point errors like 2.3 * 10 = 22.999999
  return Math.floor(value * 10 + 1e-9) / 10;
}

function isPassed(grade) {
  return grade !== null && grade <= PASS_LIMIT;
}

// Combined grade of thesis (80 %) and colloquium (20 %)
function thesisGrade(thesis, colloquium) {
  if (thesis === null || colloquium === null) return null;
  return truncateToOneDecimal(0.8 * thesis + 0.2 * colloquium);
}

// Weighted average of all passed, graded modules.
// results: [{ cp: 5, grade: 1.7 }, ...]   (grade null = no grade yet)
// Returns { average, gradedCp, weightedSum }
function weightedAverage(results) {
  let gradedCp = 0;
  let weightedSum = 0;

  results.forEach((r) => {
    if (isPassed(r.grade)) {
      gradedCp += r.cp;
      weightedSum += r.cp * r.grade;
    }
  });

  const average = gradedCp > 0 ? truncateToOneDecimal(weightedSum / gradedCp) : null;
  return { average, gradedCp, weightedSum };
}

// Verbal grade (German name in brackets, as on the certificate)
function gradeBand(grade) {
  if (grade === null) return "";
  if (grade <= 1.5) return "very good (sehr gut)";
  if (grade <= 2.5) return "good (gut)";
  if (grade <= 3.5) return "satisfactory (befriedigend)";
  if (grade <= 4.0) return "sufficient (ausreichend)";
  return "not sufficient (nicht ausreichend)";
}

// Which average is needed in the remaining graded credit points
// to finish with `target` or better?
// Because decimals are cut off, a final grade of e.g. 2.0 is reached
// as long as the exact average is below 2.1.
function requiredAverage(currentWeightedSum, currentCp, remainingCp, target) {
  if (remainingCp <= 0) return null;
  const limit = target + 0.1; // exact average must stay below this value
  const needed = (limit * (currentCp + remainingCp) - currentWeightedSum) / remainingCp;
  return needed;
}

// Format a grade the German way with a decimal comma: 1.7 -> "1,7"
function formatGrade(grade) {
  return grade === null ? "–" : grade.toFixed(1).replace(".", ",");
}

// Make the functions available for Node.js tests as well
if (typeof module !== "undefined") {
  module.exports = {
    GRADES, PASS_LIMIT, truncateToOneDecimal, isPassed, thesisGrade,
    weightedAverage, gradeBand, requiredAverage, formatGrade
  };
}
