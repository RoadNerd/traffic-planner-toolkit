let countRecords = [];

const vehicleTypes = [
  "Light Vehicle",
  "Heavy Vehicle",
  "Bus",
  "Pedestrian"
];

function getAppSetup() {
  return [
    {
      roadInputId: "road1Name",
      roadName: document.getElementById("road1Name").value || "Road 1",
      directions: [
        document.getElementById("road1DirA").value,
        document.getElementById("road1DirB").value
      ]
    },
    {
      roadInputId: "road2Name",
      roadName: document.getElementById("road2Name").value || "Road 2",
      directions: [
        document.getElementById("road2DirA").value,
        document.getElementById("road2DirB").value
      ]
    }
  ];
}

function addCount(road, direction, vehicleType) {
  const siteName = document.getElementById("siteName").value || "Unnamed Site";
  const projectName = document.getElementById("projectName").value || "Unnamed Project";
  const now = new Date();

  const record = {
    timestamp: now.toLocaleString(),
    dateISO: now.toISOString(),
    site: siteName,
    project: projectName,
    road: road,
    direction: direction,
    vehicleType: vehicleType
  };

  countRecords.push(record);
  updateDisplay();
}

function undoLast() {
  countRecords.pop();
  updateDisplay();
}

function clearAllCounts() {
  const confirmClear = confirm("Clear all traffic counts? This cannot be undone.");

  if (!confirmClear) {
    return;
  }

  countRecords = [];
  updateDisplay();
}

function countVehicle(road, direction, vehicleType) {
  return countRecords.filter(record =>
    record.road === road &&
    record.direction === direction &&
    record.vehicleType === vehicleType
  ).length;
}

function countDirectionTotal(road, direction) {
  return countRecords.filter(record =>
    record.road === road &&
    record.direction === direction
  ).length;
}

function countRoadTotal(road) {
  return countRecords.filter(record => record.road === road).length;
}

function vehicleLabel(vehicleType) {
  if (vehicleType === "Light Vehicle") return "Car / Light";
  return vehicleType;
}

function renderCountScreen() {
  const countScreen = document.getElementById("countScreen");
  const setup = getAppSetup();

  countScreen.innerHTML = "";

  setup.forEach(roadSetup => {
    const roadCard = document.createElement("section");
    roadCard.className = "card";

    const roadTitle = document.createElement("h2");
    roadTitle.innerText = roadSetup.roadName + " Count";
    roadCard.appendChild(roadTitle);

    roadSetup.directions.forEach(direction => {
      const directionBlock = document.createElement("div");
      directionBlock.className = "direction-block";

      const directionTitle = document.createElement("div");
      directionTitle.className = "direction-title";
      directionTitle.innerText = direction;
      directionBlock.appendChild(directionTitle);

      const buttonGrid = document.createElement("div");
      buttonGrid.className = "button-grid";

      vehicleTypes.forEach(vehicleType => {
        const button = document.createElement("button");
        const currentCount = countVehicle(roadSetup.roadName, direction, vehicleType);

        button.innerHTML = `${vehicleLabel(vehicleType)} <span class="vehicle-count">${currentCount}</span>`;
        button.onclick = function () {
          addCount(roadSetup.roadName, direction, vehicleType);
        };

        buttonGrid.appendChild(button);
      });

      directionBlock.appendChild(buttonGrid);

      const directionTotal = document.createElement("div");
      directionTotal.className = "direction-total";
      directionTotal.innerText = "Direction Total: " + countDirectionTotal(roadSetup.roadName, direction);
      directionBlock.appendChild(directionTotal);

      roadCard.appendChild(directionBlock);
    });

    const roadTotal = document.createElement("div");
    roadTotal.className = "road-total";
    roadTotal.innerText = "Road Total: " + countRoadTotal(roadSetup.roadName);
    roadCard.appendChild(roadTotal);

    countScreen.appendChild(roadCard);
  });
}

function updateDisplay() {
  renderCountScreen();

  document.getElementById("overallTotal").innerText = countRecords.length;

  const lastEntryElement = document.getElementById("lastEntry");

  if (countRecords.length === 0) {
    lastEntryElement.innerText = "None yet";
    return;
  }

  const last = countRecords[countRecords.length - 1];

  lastEntryElement.innerText =
    `${last.timestamp} | ${last.road} | ${last.direction} | ${last.vehicleType}`;
}

function exportCSV() {
  if (countRecords.length === 0) {
    alert("No traffic counts recorded yet.");
    return;
  }

  let csv = "";

  csv += "TRAFFIC COUNT SUMMARY\n";
  csv += "Road,Direction,Vehicle Type,Total\n";

  const summary = {};

  countRecords.forEach(record => {
    const key = record.road + "|" + record.direction + "|" + record.vehicleType;

    if (!summary[key]) {
      summary[key] = {
        road: record.road,
        direction: record.direction,
        vehicleType: record.vehicleType,
        total: 0
      };
    }

    summary[key].total++;
  });

  Object.values(summary).forEach(item => {
    csv += `"${item.road}","${item.direction}","${item.vehicleType}",${item.total}\n`;
  });

  csv += "\n\n";
  csv += "RAW TRAFFIC COUNT RECORDS\n";
  csv += "Timestamp,ISO Time,Site,Project,Road,Direction,Vehicle Type\n";

  countRecords.forEach(record => {
    csv += `"${record.timestamp}","${record.dateISO}","${record.site}","${record.project}","${record.road}","${record.direction}","${record.vehicleType}"\n`;
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "traffic-count.csv";
  downloadLink.click();

  URL.revokeObjectURL(url);
}

function connectSetupListeners() {
  const setupElementIds = [
    "road1Name",
    "road1DirA",
    "road1DirB",
    "road2Name",
    "road2DirA",
    "road2DirB"
  ];

  setupElementIds.forEach(id => {
    const element = document.getElementById(id);
    element.addEventListener("input", updateDisplay);
    element.addEventListener("change", updateDisplay);
  });
}

connectSetupListeners();
updateDisplay();
