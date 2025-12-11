// ========================
//  GENERAL TRACKER ENGINE
// ========================

function loadState(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { completed: [], missed: [] };
    const parsed = JSON.parse(raw);

    return {
      completed: Array.isArray(parsed.completed) ? parsed.completed : [],
      missed: Array.isArray(parsed.missed) ? parsed.missed : []
    };
  } catch (e) {
    return { completed: [], missed: [] };
  }
}

function saveState(key, completed, missed) {
  localStorage.setItem(key, JSON.stringify({ completed, missed }));
}

function updateStats(idPrefix, completed, missed) {
  const completedEl = document.getElementById(`stat-completed-${idPrefix}`);
  const consistencyEl = document.getElementById(`stat-consistency-${idPrefix}`);

  const completedCount = completed.length;
  const attempted = completed.length + missed.length;

  const consistency = attempted > 0
    ? Math.round((completedCount / attempted) * 100)
    : 0;

  completedEl.textContent = `Completed: ${completedCount} / 100 days`;

  if (attempted === 0) {
    consistencyEl.textContent = "Consistency so far: 0% (0 / 0 days attempted)";
  } else {
    consistencyEl.textContent =
      `Consistency so far: ${consistency}% (${completedCount} good / ${attempted} attempted)`;
  }
}

// Create a 100-day grid inside a given block
function createTracker(gridId, storageKey, idPrefix) {
  const grid = document.getElementById(gridId);
  let { completed, missed } = loadState(storageKey);

  for (let row = 0; row < 10; row++) {
    const rowEl = document.createElement("div");
    rowEl.className = "day-row";

    for (let col = 0; col < 10; col++) {
      const dayNumber = row + 1 + col * 10;

      const dayEl = document.createElement("div");
      dayEl.className = "day";
      dayEl.textContent = dayNumber;

      // initial load states
      if (completed.includes(dayNumber)) dayEl.classList.add("completed");
      if (missed.includes(dayNumber)) dayEl.classList.add("missed");

      // click behavior: blank → completed → missed → blank
      dayEl.addEventListener("click", () => {
        const isCompleted = dayEl.classList.contains("completed");
        const isMissed = dayEl.classList.contains("missed");

        if (!isCompleted && !isMissed) {
          dayEl.classList.add("completed");
          completed.push(dayNumber);
        } else if (isCompleted) {
          dayEl.classList.remove("completed");
          completed = completed.filter(d => d !== dayNumber);

          dayEl.classList.add("missed");
          missed.push(dayNumber);
        } else {
          dayEl.classList.remove("missed");
          missed = missed.filter(d => d !== dayNumber);
        }

        saveState(storageKey, completed, missed);
        updateStats(idPrefix, completed, missed);
      });

      rowEl.appendChild(dayEl);
    }

    grid.appendChild(rowEl);
  }

  updateStats(idPrefix, completed, missed);
}

// ========================
//  BUILD ALL THREE VERSIONS
// ========================

createTracker("days-grid-v1", "hundred_days_state_v1", "v1");
createTracker("days-grid-v2", "hundred_days_state_v2", "v2");
createTracker("days-grid-v3", "hundred_days_state_v3", "v3");
