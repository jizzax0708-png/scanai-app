function scanFake() {
  document.getElementById("result").innerText =
    "📷 Scanner ready... (demo mode)";
}

function checkFood() {
  let code = document.getElementById("codeInput").value;

  if (!code) {
    document.getElementById("result").innerText =
      "⚠️ Enter QR or barcode first!";
    return;
  }

  // demo AI logic
  let random = Math.random();

  if (random < 0.4) {
    document.getElementById("result").innerText = "🟢 HALAL";
  } else if (random < 0.7) {
    document.getElementById("result").innerText = "🟠 SHUBHALI";
  } else {
    document.getElementById("result").innerText = "🔴 HARAM";
  }
}