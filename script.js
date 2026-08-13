let countRecords = [];

// -----------------------------
// TIMER VARIABLES
// -----------------------------

let timerDurationSeconds = 15 * 60;
let timerRemainingSeconds = timerDurationSeconds;

let timerInterval = null;
let timerRunning = false;
let timerPaused = false;

let countStartTime = null;
let countFinishTime = null;


// -----------------------------
// TIMER FUNCTIONS
// -----------------------------

function setTimer(minutes) {
  if (timerRunning) {
    alert("Pause or finish the current count before changing the timer.");
    return;
  }

  timerDurationSeconds = minutes * 60;
  timerRemainingSeconds = timerDurationSeconds;

  document.getElementById("timerStatus").innerText = "Ready";
  updateTimerDisplay();
}

function setCustomTimer() {
  const customMinutes = Number(
    document.getElementById("customMinutes").value
  );

  if (!customMinutes || customMinutes < 1) {
    alert("Please enter a valid number of minutes.");
    return;
  }

  setTimer(customMinutes);
}

function startTimer() {
  if (timerRunning && !timerPaused) {
    return;
  }

  if (!countStartTime) {
    countStartTime = new Date();
  }

  timerRunning = true;
  timerPaused = false;

  document.getElementById("timerStatus").innerText = "Counting";

  document.getElementById("startTimerButton").innerText = "COUNT RUNNING";
  document.getElementById("startTimerButton").disabled = true;

  document.getElementById("pauseTimerButton").disabled = false;
  document.getElementById("finishTimerButton").disabled = false;

  clearInterval(timerInterval);

  timerInterval = setInterval(function () {
    timerRemainingSeconds--;

    if (timerRemainingSeconds <= 0) {
      timerRemainingSeconds = 0;
      updateTimerDisplay();
      completeTimer();
      return;
    }

    updateTimerDisplay();
  }, 1000);

  updateTimerDisplay();
}

function pauseTimer() {
  if (!timerRunning) {
    return;
  }

  if (!timerPaused) {
    clearInterval(timerInterval);

    timerPaused = true;

    document.getElementById("timerStatus").innerText = "Paused";
    document.getElementById("pauseTimerButton").innerText = "RESUME";

  } else {
    timerPaused = false;

    document.getElementById("timerStatus").innerText = "Counting";
    document.getElementById("pauseTimerButton").innerText = "PAUSE";

    timerInterval = setInterval(function () {
      timerRemainingSeconds--;

      if (timerRemainingSeconds <= 0) {
        timerRemainingSeconds = 0;
        updateTimerDisplay();
        completeTimer();
        return;
      }

      updateTimerDisplay();
    }, 1000);
  }
}

function finishTimer() {
  clearInterval(timerInterval);

  countFinishTime = new Date();

  timerRunning = false;
  timerPaused = false;

  document.getElementById("timerStatus").innerText = "Count Finished";

  document.getElementById("startTimerButton").innerText = "START COUNT";
  document.getElementById("startTimerButton").disabled = true;

  document.getElementById("pauseTimerButton").innerText = "PAUSE";
  document.getElementById("pauseTimerButton").disabled = true;

  document.getElementById("finishTimerButton").disabled = true;
}

function completeTimer() {
  clearInterval(timerInterval);

  countFinishTime = new Date();

  timerRunning = false;
  timerPaused = false;

  document.getElementById("timerStatus").innerText = "COUNT COMPLETE";

  document.getElementById("startTimerButton").innerText = "COUNT COMPLETE";
  document.getElementById("startTimerButton").disabled = true;

  document.getElementById("pauseTimerButton").disabled = true;
  document.getElementById("finishTimerButton").disabled = true;

  if (navigator.vibrate) {
    navigator.vibrate([300, 200, 300]);
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timerRemainingSeconds / 60);
  const seconds = timerRemainingSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  document.getElementById("timerDisplay").innerText =
    formattedMinutes + ":" + formattedSeconds;
}


// -----------------------------
// ADD TRAFFIC COUNT
// -----------------------------

function addCount(directionKey, vehicleType) {
  const siteName =
    document.getElementById("siteName").value || "Unnamed Site";

  const projectName =
    document.getElementById("projectName").value || "Unnamed Project";

  const roadName =
    document.getElementById("roadName").value || "Unnamed Road";

  const laneType =
    document.getElementById("laneType").value;

  let direction;

  if (directionKey === "A") {
    direction = document.getElementById("directionA").value;
  } else {
    direction = document.getElementById("directionB").value;
  }

  const now = new Date();

  const record = {
    timestamp: now.toLocaleString(),
    dateISO: now.toISOString(),
    site: siteName,
    project: projectName,
    road: roadName,
    laneType: laneType,
    direction: direction,
    vehicleType: vehicleType
  };

  countRecords.push(record);

  updateDisplay();
}


// -----------------------------
// UNDO LAST COUNT
// -----------------------------

function undoLast() {
  if (countRecords.length === 0) {
    return;
  }

  countRecords.pop();
  updateDisplay();
}


// -----------------------------
// COUNT HELPERS
// -----------------------------

function countMatches(direction, vehicleType) {
  return countRecords.filter(function (record) {
    return (
      record.direction === direction &&
      record.vehicleType === vehicleType
    );
  }).length;
}

function countDirectionTotal(direction) {
  return countRecords.filter(function (record) {
    return record.direction === direction;
  }).length;
}


// -----------------------------
// UPDATE LABELS
// -----------------------------

function updateLabels() {
  const roadName =
    document.getElementById("roadName").value || "Traffic";

  const directionA =
    document.getElementById("directionA").value;

  const directionB =
    document.getElementById("directionB").value;

  document.getElementById("roadTitle").innerText =
    roadName + " Count";

  document.getElementById("directionALabel").innerText =
    directionA;

  document.getElementById("directionBLabel").innerText =
    directionB;
}


// -----------------------------
// UPDATE DISPLAY
// -----------------------------

function updateDisplay() {
  updateLabels();

  const directionA =
    document.getElementById("directionA").value;

  const directionB =
    document.getElementById("directionB").value;

  document.getElementById("directionALight").innerText =
    countMatches(directionA, "Light Vehicle");

  document.getElementById("directionAHeavy").innerText =
    countMatches(directionA, "Heavy Vehicle");

  document.getElementById("directionABus").innerText =
    countMatches(directionA, "Bus");

  document.getElementById("directionAPedestrian").innerText =
    countMatches(directionA, "Pedestrian");

  document.getElementById("directionATotal").innerText =
    countDirectionTotal(directionA);

  document.getElementById("directionBLight").innerText =
    countMatches(directionB, "Light Vehicle");

  document.getElementById("directionBHeavy").innerText =
    countMatches(directionB, "Heavy Vehicle");

  document.getElementById("directionBBus").innerText =
    countMatches(directionB, "Bus");

  document.getElementById("directionBPedestrian").innerText =
    countMatches(directionB, "Pedestrian");

  document.getElementById("directionBTotal").innerText =
    countDirectionTotal(directionB);

  document.getElementById("totalCount").innerText =
    countRecords.length;

  if (countRecords.length === 0) {
    document.getElementById("lastEntry").innerText =
      "None yet";
    return;
  }

  const last =
    countRecords[countRecords.length - 1];

  document.getElementById("lastEntry").innerText =
    last.timestamp +
    " | " +
    last.road +
    " | " +
    last.direction +
    " | " +
    last.vehicleType;
}


// -----------------------------
// REPORT HELPERS
// -----------------------------

function formatDateTime(date) {
  if (!date) {
    return "";
  }

  return date.toLocaleString();
}

function getActualDurationMinutes() {
  if (!countStartTime) {
    return "";
  }

  const endTime =
    countFinishTime || new Date();

  const milliseconds =
    endTime - countStartTime;

  return (milliseconds / 60000).toFixed(1);
}


// -----------------------------
// EXPORT REPORT
// -----------------------------

function exportCSV() {
  if (countRecords.length === 0) {
    alert("No traffic counts recorded yet.");
    return;
  }

  const roadName =
    document.getElementById("roadName").value || "Unnamed Road";

  const siteName =
    document.getElementById("siteName").value || "Unnamed Site";

  const projectName =
    document.getElementById("projectName").value || "Unnamed Project";

  const laneType =
    document.getElementById("laneType").value;

  const directionA =
    document.getElementById("directionA").value;

  const directionB =
    document.getElementById("directionB").value;

  const lightTotal =
    countRecords.filter(function (record) {
      return record.vehicleType === "Light Vehicle";
    }).length;

  const heavyTotal =
    countRecords.filter(function (record) {
      return record.vehicleType === "Heavy Vehicle";
    }).length;

  const busTotal =
    countRecords.filter(function (record) {
      return record.vehicleType === "Bus";
    }).length;

  const pedestrianTotal =
    countRecords.filter(function (record) {
      return record.vehicleType === "Pedestrian";
    }).length;

  const directionATotal =
    countDirectionTotal(directionA);

  const directionBTotal =
    countDirectionTotal(directionB);

  const vehicleTotal =
    lightTotal + heavyTotal + busTotal;

  let heavyPercent = 0;

  if (vehicleTotal > 0) {
    heavyPercent =
      ((heavyTotal / vehicleTotal) * 100).toFixed(1);
  }

  let equivalentHourlyFlow = "";

  const actualDurationMinutes =
    Number(getActualDurationMinutes());

  if (
    actualDurationMinutes > 0 &&
    vehicleTotal > 0
  ) {
    equivalentHourlyFlow =
      Math.round(
        vehicleTotal * (60 / actualDurationMinutes)
      );
  }


  let csv = "";

  csv += "TRAFFIC PLANNER TOOLKIT\n";
  csv += "TRAFFIC COUNT DASHBOARD\n\n";

  csv += 'Site,"' + siteName + '"\n';
  csv += 'Client / Project,"' + projectName + '"\n';
  csv += 'Road,"' + roadName + '"\n';
  csv += 'Lane / Movement Type,"' + laneType + '"\n';

  csv +=
    'Count Start,"' +
    formatDateTime(countStartTime) +
    '"\n';

  csv +=
    'Count Finish,"' +
    formatDateTime(countFinishTime) +
    '"\n';

  csv +=
    'Actual Duration (minutes),"' +
    getActualDurationMinutes() +
    '"\n';

  csv += "\n";

  csv += "TRAFFIC SUMMARY\n";
  csv += "Total Vehicles," + vehicleTotal + "\n";
  csv += "Light Vehicles," + lightTotal + "\n";
  csv += "Heavy Vehicles," + heavyTotal + "\n";
  csv += "Bus," + busTotal + "\n";
  csv += "Pedestrians," + pedestrianTotal + "\n";
  csv += "Heavy Vehicle %," + heavyPercent + "%\n";

  if (equivalentHourlyFlow !== "") {
    csv +=
      "Equivalent Hourly Flow," +
      equivalentHourlyFlow +
      " veh/hr\n";
  }

  csv += "\n";

  csv += "DIRECTION SUMMARY\n";
  csv += "Direction,Total\n";
  csv += '"' + directionA + '",' + directionATotal + "\n";
  csv += '"' + directionB + '",' + directionBTotal + "\n";

  csv += "\n\n";

  csv += "RAW COUNT DATA\n";

  csv +=
    "Timestamp,ISO Time,Site,Client / Project,Road,Lane / Movement Type,Direction,Vehicle Type\n";

  countRecords.forEach(function (record) {
    csv +=
      '"' + record.timestamp + '",' +
      '"' + record.dateISO + '",' +
      '"' + record.site + '",' +
      '"' + record.project + '",' +
      '"' + record.road + '",' +
      '"' + record.laneType + '",' +
      '"' + record.direction + '",' +
      '"' + record.vehicleType + '"\n';
  });

  const blob =
    new Blob(
      [csv],
      { type: "text/csv;charset=utf-8;" }
    );

  const url =
    URL.createObjectURL(blob);

  const downloadLink =
    document.createElement("a");

  downloadLink.href = url;

  downloadLink.download =
    "traffic-count-report.csv";

  document.body.appendChild(downloadLink);

  downloadLink.click();

  document.body.removeChild(downloadLink);

  URL.revokeObjectURL(url);
}


// -----------------------------
// LIVE SETUP UPDATES
// -----------------------------

document
  .getElementById("roadName")
  .addEventListener("input", updateDisplay);

document
  .getElementById("directionA")
  .addEventListener("change", updateDisplay);

document
  .getElementById("directionB")
  .addEventListener("change", updateDisplay);


// -----------------------------
// INITIAL DISPLAY
// -----------------------------

updateTimerDisplay();
updateDisplay();
