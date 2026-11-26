// ==========================================================
// User interface of the grade calculator.
// Builds the module tables from STUDY_PLANS, reads the inputs,
// and shows the results using the functions in gradeCalculator.js.
// ==========================================================

const STORAGE_KEY = "fhdo-wi-grades-v1";

// state = { plan: "wi6", entries: { moduleId: { grade, passed, choice, thesis, colloquium } } }
let state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  setupPlanSelect();
  setupTargetSelect();
  document.getElementById("reset-btn").addEventListener("click", resetGrades);
  render();
});

// ---------- Saving in the browser ----------

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && STUDY_PLANS[saved.plan]) return saved;
  } catch (e) {
    // ignore broken data
  }
  return { plan: "wi6", entries: {} };
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function entry(id) {
  if (!state.entries[id]) state.entries[id] = {};
  return state.entries[id];
}

// ---------- Settings ----------

function setupPlanSelect() {
  const select = document.getElementById("plan-select");
  Object.entries(STUDY_PLANS).forEach(([key, plan]) => {
    select.add(new Option(plan.title, key));
  });
  select.value = state.plan;
  select.addEventListener("change", () => {
    state.plan = select.value;
    saveState();
    render();
  });
}

function setupTargetSelect() {
  const select = document.getElementById("target");
  for (let g = 1.0; g <= 4.0 + 1e-9; g += 0.1) {
    const value = Math.round(g * 10) / 10;
    select.add(new Option(formatGrade(value), value));
  }
  select.value = "2";
  select.addEventListener("change", updateSummary);
}

function resetGrades() {
  if (confirm("Delete all entered grades?")) {
    state.entries = {};
    saveState();
    render();
  }
}

// ---------- Building the module tables ----------

function render() {
  const plan = STUDY_PLANS[state.plan];
  const container = document.getElementById("semesters");
  container.innerHTML = "";

  const semesters = [...new Set(plan.modules.map((m) => m.semester))];
  semesters.forEach((semester) => {
    const card = document.createElement("section");
    card.className = "card semester-card";
    const modules = plan.modules.filter((m) => m.semester === semester);
    const cp = modules.reduce((sum, m) => sum + m.cp, 0);

    card.innerHTML = `
      <h2>Semester ${semester} <span class="cp-badge">${formatCp(cp)} CP</span></h2>
      <table class="module-table">
        <thead>
          <tr><th scope="col">Module</th><th scope="col">CP</th><th scope="col">Grade</th><th scope="col">Status</th></tr>
        </thead>
        <tbody></tbody>
      </table>`;

    const tbody = card.querySelector("tbody");
    modules.forEach((module) => tbody.appendChild(createModuleRow(module)));
    container.appendChild(card);
  });

  updateSummary();
}

function createModuleRow(module) {
  const row = document.createElement("tr");
  row.dataset.id = module.id;
  const e = entry(module.id);

  // Name column (with an extra drop-down for elective modules)
  const nameCell = document.createElement("td");
  nameCell.innerHTML = `<span class="module-name">${module.name}</span>`;
  if (module.choice) {
    const choice = document.createElement("select");
    choice.className = "choice-select";
    choice.setAttribute("aria-label", `Choose module for ${module.name}`);
    choice.add(new Option("Choose a module…", ""));
    module.choice.forEach((name) => choice.add(new Option(name, name)));
    choice.value = e.choice || "";
    choice.addEventListener("change", () => {
      e.choice = choice.value;
      saveState();
      updateChoiceOptions();
    });
    nameCell.appendChild(choice);
  }
  if (!module.graded) {
    nameCell.insertAdjacentHTML("beforeend", ` <span class="tag">ungraded</span>`);
  }

  const cpCell = document.createElement("td");
  cpCell.textContent = formatCp(module.cp);

  // Grade column
  const gradeCell = document.createElement("td");
  if (module.thesis) {
    gradeCell.className = "thesis-cell";
    gradeCell.appendChild(createGradeSelect(e.thesis, "Thesis (80 %)", (v) => { e.thesis = v; }));
    gradeCell.appendChild(createGradeSelect(e.colloquium, "Colloquium (20 %)", (v) => { e.colloquium = v; }));
  } else if (module.graded) {
    gradeCell.appendChild(createGradeSelect(e.grade, `Grade for ${module.name}`, (v) => { e.grade = v; }));
  } else {
    const label = document.createElement("label");
    label.className = "passed-check";
    label.innerHTML = `<input type="checkbox"> passed`;
    const checkbox = label.querySelector("input");
    checkbox.checked = !!e.passed;
    checkbox.addEventListener("change", () => {
      e.passed = checkbox.checked;
      saveState();
      updateSummary();
    });
    gradeCell.appendChild(label);
  }

  const statusCell = document.createElement("td");
  statusCell.className = "status";

  row.append(nameCell, cpCell, gradeCell, statusCell);
  return row;
}

function createGradeSelect(value, label, onChange) {
  const wrapper = document.createElement("span");
  wrapper.className = "grade-input";

  const select = document.createElement("select");
  select.setAttribute("aria-label", label);
  select.add(new Option("–", ""));
  GRADES.forEach((g) => select.add(new Option(formatGrade(g), g)));
  select.value = value === null || value === undefined ? "" : String(value);

  select.addEventListener("change", () => {
    onChange(select.value === "" ? null : Number(select.value));
    saveState();
    updateSummary();
  });

  // Show a small caption for the thesis inputs
  if (label.includes("%")) {
    const caption = document.createElement("small");
    caption.textContent = label;
    wrapper.appendChild(caption);
  }
  wrapper.appendChild(select);
  return wrapper;
}

// An elective may only be chosen once, and the module chosen in
// "Angewandte BWL" cannot be used again as an elective (StgPO Anlage 2).
function updateChoiceOptions() {
  const plan = STUDY_PLANS[state.plan];
  const chosen = plan.modules
    .filter((m) => m.choice && entry(m.id).choice)
    .map((m) => ({ id: m.id, name: entry(m.id).choice }));

  document.querySelectorAll("#semesters tr").forEach((row) => {
    const select = row.querySelector(".choice-select");
    if (!select) return;
    [...select.options].forEach((option) => {
      option.disabled = option.value !== "" &&
        chosen.some((c) => c.name === option.value && c.id !== row.dataset.id);
    });
  });
}

// ---------- Results ----------

// Turns the plan + inputs into one result per module: { module, grade, passed }
function collectResults() {
  const plan = STUDY_PLANS[state.plan];
  return plan.modules.map((module) => {
    const e = entry(module.id);
    let grade = null;
    let passed = false;

    if (module.thesis) {
      grade = thesisGrade(e.thesis ?? null, e.colloquium ?? null);
      // the thesis itself must be at least 4.0 to be admitted to the colloquium (RahmenPO § 32 (2))
      passed = grade !== null && isPassed(grade) && isPassed(e.thesis);
    } else if (module.graded) {
      grade = e.grade ?? null;
      passed = isPassed(grade);
    } else {
      passed = !!e.passed;
    }
    return { module, grade, passed };
  });
}

function updateSummary() {
  const plan = STUDY_PLANS[state.plan];
  const results = collectResults();

  // Status column of every row
  results.forEach((r) => {
    const cell = document.querySelector(`tr[data-id="${r.module.id}"] .status`);
    if (!cell) return;
    if (r.passed) {
      cell.innerHTML = r.module.thesis
        ? `<span class="chip chip-pass">✓ ${formatGrade(r.grade)}</span>`
        : `<span class="chip chip-pass">✓ passed</span>`;
    } else if (r.grade !== null && !isPassed(r.grade)) {
      cell.innerHTML = `<span class="chip chip-fail">✗ failed</span>`;
    } else if (r.module.thesis && r.grade !== null) {
      cell.innerHTML = `<span class="chip chip-fail">✗ thesis below 4,0</span>`;
    } else {
      cell.innerHTML = `<span class="chip">open</span>`;
    }
  });

  // Final grade so far
  const graded = results
    .filter((r) => r.module.graded && r.passed)
    .map((r) => ({ cp: r.module.cp, grade: r.grade }));
  const { average, gradedCp, weightedSum } = weightedAverage(graded);

  document.getElementById("average").textContent = formatGrade(average);
  document.getElementById("band").textContent = average === null ? "Enter your first grade" : gradeBand(average);
  document.getElementById("average-basis").textContent = average === null
    ? ""
    : `Based on ${formatCp(gradedCp)} graded CP. Decimals after the first are cut off.`;

  // Credit points
  const earnedCp = results.filter((r) => r.passed).reduce((sum, r) => sum + r.module.cp, 0);
  const percent = Math.min(100, (earnedCp / plan.totalCp) * 100);
  document.getElementById("cp-bar").style.width = `${percent}%`;
  document.getElementById("cp-text").textContent =
    `${formatCp(earnedCp)} of ${plan.totalCp} CP earned (${Math.floor(percent)} %)`;

  // Average per semester
  const list = document.getElementById("semester-averages");
  list.innerHTML = "";
  [...new Set(plan.modules.map((m) => m.semester))].forEach((semester) => {
    const semesterResults = results
      .filter((r) => r.module.semester === semester && r.module.graded && r.passed)
      .map((r) => ({ cp: r.module.cp, grade: r.grade }));
    const semesterAvg = weightedAverage(semesterResults).average;
    const li = document.createElement("li");
    li.innerHTML = `<span>Semester ${semester}</span><strong>${formatGrade(semesterAvg)}</strong>`;
    list.appendChild(li);
  });

  // Failed modules
  const failed = results.filter((r) => r.grade !== null && !r.passed);
  document.getElementById("failed-box").hidden = failed.length === 0;
  document.getElementById("failed-list").innerHTML = failed
    .map((r) => `<li>${r.module.choice && entry(r.module.id).choice ? entry(r.module.id).choice : r.module.name}</li>`)
    .join("");

  // Target grade
  const totalGradedCp = plan.modules.filter((m) => m.graded).reduce((sum, m) => sum + m.cp, 0);
  const remainingCp = totalGradedCp - gradedCp;
  const target = Number(document.getElementById("target").value);
  const output = document.getElementById("target-result");

  if (remainingCp <= 0) {
    output.textContent = average !== null && average <= target
      ? `Done – your final grade is ${formatGrade(average)}.`
      : `All graded modules are finished; your final grade is ${formatGrade(average)}.`;
  } else {
    const needed = requiredAverage(weightedSum, gradedCp, remainingCp, target);
    if (needed < 1.0) {
      output.textContent = `${formatGrade(target)} cannot be reached anymore – even with 1,0 in all remaining ${formatCp(remainingCp)} CP.`;
    } else if (needed > 4.0) {
      output.textContent = `You will reach ${formatGrade(target)} or better as long as you pass the remaining ${formatCp(remainingCp)} CP.`;
    } else {
      output.textContent = `You need an average better than ${needed.toFixed(2).replace(".", ",")} in the remaining ${formatCp(remainingCp)} graded CP.`;
    }
  }

  updateChoiceOptions();
}

// 2.5 -> "2,5", 5 -> "5"
function formatCp(cp) {
  return String(cp).replace(".", ",");
}
