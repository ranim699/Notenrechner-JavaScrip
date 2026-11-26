# Grade Calculator – Wirtschaftsinformatik, FH Dortmund (JavaScript)

> Calculates the current and expected final grade of the Bachelor Wirtschaftsinformatik at FH Dortmund using the German grading system (1.0–5.0), weighted by credit points.

## Origin

The calculator was rebuilt for the German grading system and the study plan of FH Dortmund; none of the original calculation code is left.

Based on a repository by [ranim699](https://github.com/ranim699).

## What it does

All modules of the study plan are listed by semester with their credit points. You choose your grades from the allowed German grades (1.0, 1.3, 1.7 ... 4.0, 5.0), tick ungraded modules as passed and pick your electives. The page shows the weighted average with the verbal grade (sehr gut, gut ...), earned credit points, an average per semester, failed modules and which average you still need to reach a target grade. Both study variants are included: 6 semesters (180 CP) and 7 semesters with Praxissemester (210 CP). Grades are saved in the browser (localStorage).

## Tech stack

| Technology | Used for |
|---|---|
| HTML / CSS | Page structure and responsive layout (CSS Grid, sticky summary). |
| JavaScript (vanilla) | Builds the tables from the study plan data, reacts to inputs, calculates the grades, stores them in `localStorage`. |
| Node.js + Express | Small web server that delivers the page (`server.js`). |

## Project structure

| Path | Content |
|---|---|
| `public/index.html` | The page. |
| `public/js/studyPlan.js` | Modules, semesters and credit points of both study variants (from the official study plan). |
| `public/js/gradeCalculator.js` | The grading rules as pure functions (no HTML) – easy to test. |
| `public/js/app.js` | User interface: tables, inputs, results. |
| `public/css/style.css` | Design. |
| `tests/gradeCalculator.test.js` | Automated tests for the grading rules. |
| `server.js` | Express server on port 3000. |

## How to run

1. Install Node.js and run `npm install` in the folder.
2. Run `npm start` and open http://localhost:3000.
3. Without Node.js: open `public/index.html` directly in the browser.
4. Run the tests with `npm test`.

## Key concepts

- Grading rules of FH Dortmund: allowed grades 1.0–5.0, passed up to 4.0 (Rahmenprüfungsordnung § 9, § 20).
- Final grade = average weighted by credit points; only the first decimal counts, the rest is cut off without rounding (RahmenPO § 9 (6), StgPO § 35).
- Ungraded modules (Lern- u. Arbeitstechniken, Technisches Englisch, Seminar Methodik, Praxissemester) do not count (StgPO Anlage 1).
- Thesis 80 % and colloquium 20 % (StgPO § 33).
- Separating data (`studyPlan.js`), logic (`gradeCalculator.js`) and presentation (`app.js`).

## Known issues

- Unofficial planning tool – the grades in the official FH Dortmund portal are binding.
- The study plan follows the StgPO Wirtschaftsinformatik (reading version 09/2025). If the regulations change, `studyPlan.js` must be updated.
- Projektarbeit is entered as one 15 CP module; the official plan also allows splitting it into 5 + 10 CP.

## Ideas for improvements

- Chart of the grade development per semester.
- Export the grades as PDF or CSV.
- Add more study programmes (e.g. Informatik) as additional entries in `studyPlan.js`.

## My changes

- _(describe here what you built or improved yourself)_
