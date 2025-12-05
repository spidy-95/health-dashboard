// ================== CONFIG ==================
const API_URL = "https://fedskillstest.coalitiontechnologies.workers.dev";

// Replace with the username + password from the skills-test instructions
const API_USERNAME = "YOUR_USERNAME_HERE";  
const API_PASSWORD = "YOUR_PASSWORD_HERE";
// ================== BOOTSTRAP ==================

document.addEventListener("DOMContentLoaded", () => {
  loadPatientData().catch((err) => {
    console.error("Failed to load patient data:", err);
  });
});

async function loadPatientData() {
  console.log("loadPatientData() is running...");

  const headers = {};

  // Basic Auth header
  if (API_USERNAME && API_PASSWORD) {
    const token = btoa(`${API_USERNAME}:${API_PASSWORD}`);
    headers["Authorization"] = `Basic ${token}`;
  }

  const response = await fetch(API_URL, { headers });

  if (!response.ok) {
    throw new Error("Network response was not ok: " + response.status);
  }

  const data = await response.json();
  console.log("Full API data:", data);

  // Find Jessica Taylor
  const jessica = data.find((p) => p.name === "Jessica Taylor");
  console.log("Jessica from API:", jessica);

  if (!jessica) {
    throw new Error("Jessica Taylor not found in API data");
  }

  // Update UI
  updateProfilePanel(jessica);
  updateVitals(jessica);
  updateDiagnosticList(jessica);
  updateLabResults(jessica);
  updateBloodPressureChart(jessica);
}

// ================== PROFILE PANEL ==================

function updateProfilePanel(patient) {
  const nameEl = document.getElementById("profile-name");
  const dobEl = document.getElementById("dob-value");
  const genderEl = document.getElementById("gender-value");
  const contactEl = document.getElementById("contact-value");
  const emergencyEl = document.getElementById("emergency-value");
  const insuranceEl = document.getElementById("insurance-value");
  const photoEl = document.getElementById("profile-picture");

  if (nameEl) nameEl.textContent = patient.name || "Jessica Taylor";
  if (dobEl) dobEl.textContent = patient.date_of_birth || "08/23/1996";
  if (genderEl) genderEl.textContent = patient.gender || "Female";
  if (contactEl) contactEl.textContent = patient.phone_number || "(—)";
  if (emergencyEl) emergencyEl.textContent = patient.emergency_contact || "(—)";
  if (insuranceEl) {
    insuranceEl.textContent =
      patient.insurance_type || patient.insurance_provider || "(—)";
  }

  // Profile picture (img src)
  if (photoEl) {
    if (patient.profile_picture) {
      photoEl.src = patient.profile_picture;
    } else {
      // If API has no picture, you can keep it blank or use a placeholder
      photoEl.src = "";
    }
  }
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

// ================== VITALS ==================

function updateVitals(patient) {
  const history = patient.diagnosis_history || [];
  if (!history.length) return;

  // Most recent entry
  const latest = history[history.length - 1];

  const respValEl = document.getElementById("respiratory-value");
  const respStatusEl = document.getElementById("respiratory-status");
  const tempValEl = document.getElementById("temperature-value");
  const tempStatusEl = document.getElementById("temperature-status");
  const heartValEl = document.getElementById("heartrate-value");
  const heartStatusEl = document.getElementById("heartrate-status");

  if (respValEl && latest.respiratory_rate) {
    respValEl.textContent = `${latest.respiratory_rate.value} bpm`;
  }
  if (respStatusEl && latest.respiratory_rate) {
    respStatusEl.textContent = latest.respiratory_rate.levels || "Normal";
  }

  if (tempValEl && latest.temperature) {
    tempValEl.textContent = `${latest.temperature.value}°F`;
  }
  if (tempStatusEl && latest.temperature) {
    tempStatusEl.textContent = latest.temperature.levels || "Normal";
  }

  if (heartValEl && latest.heart_rate) {
    heartValEl.textContent = `${latest.heart_rate.value} bpm`;
  }
  if (heartStatusEl && latest.heart_rate) {
    heartStatusEl.textContent = latest.heart_rate.levels || "Lower than Average";
  }
}

// ================== DIAGNOSTIC LIST ==================

function updateDiagnosticList(patient) {
  const tableBody = document.getElementById("diagnostic-table-body");
  if (!tableBody) return;

  const list = patient.diagnostic_list || [];
  tableBody.innerHTML = ""; // clear existing rows

  list.forEach((item) => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = item.name || "";
    tr.appendChild(nameTd);

    const descTd = document.createElement("td");
    descTd.textContent = item.description || "";
    tr.appendChild(descTd);

    const statusTd = document.createElement("td");
    statusTd.textContent = item.status || "";
    tr.appendChild(statusTd);

    tableBody.appendChild(tr);
  });
}

// ================== LAB RESULTS ==================

function updateLabResults(patient) {
  const labListEl = document.getElementById("lab-list");
  if (!labListEl) return;

  const labResults = patient.lab_results || [];
  labListEl.innerHTML = "";

  // In the API, lab_results is an array of strings
  labResults.forEach((testName) => {
    const li = document.createElement("li");
    li.className = "lab-item";

    const nameSpan = document.createElement("span");
    nameSpan.className = "lab-name";
    nameSpan.textContent = testName;

    const iconSpan = document.createElement("span");
    iconSpan.className = "lab-download";
    iconSpan.textContent = "⬇";

    li.appendChild(nameSpan);
    li.appendChild(iconSpan);
    labListEl.appendChild(li);
  });
}

// ================== BLOOD PRESSURE CHART ==================

let bpChartInstance = null;

function updateBloodPressureChart(patient) {
  const history = patient.diagnosis_history || [];
  if (!history.length) return;

  // Last 5 records
  const lastFive = history.slice(-5);

  const labels = lastFive.map((entry) => entry.month || "");
  const systolic = lastFive.map(
    (entry) => entry.blood_pressure?.systolic?.value || 0
  );
  const diastolic = lastFive.map(
    (entry) => entry.blood_pressure?.diastolic?.value || 0
  );

  const canvas = document.getElementById("bpChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (bpChartInstance) {
    bpChartInstance.destroy();
  }

  bpChartInstance = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Systolic",
          data: systolic,
          tension: 0.4,
          pointRadius: 4,
          borderWidth: 2
        },
        {
          label: "Diastolic",
          data: diastolic,
          tension: 0.4,
          pointRadius: 4,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
          labels: {
            usePointStyle: true
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}
