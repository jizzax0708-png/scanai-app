// 📷 SCANNER
function startScanner() {
  Quagga.init({
    inputStream: {
      type: "LiveStream",
      target: document.querySelector("#scannerBox"),
      constraints: { facingMode: "environment" }
    },
    decoder: { readers: ["ean_reader", "code_128_reader"] }
  }, function(err) {
    if (err) return console.log(err);
    Quagga.start();
  });

  Quagga.onDetected(function(data) {
    let code = data.codeResult.code;
    Quagga.stop();
    searchProduct(code);
  });
}

// ⌨️ MANUAL
function manualMode() {
  document.getElementById("manualBox").style.display = "block";
}

function manualSearch() {
  let code = document.getElementById("codeInput").value;
  searchProduct(code);
}

// 🔍 MAIN FUNCTION
async function searchProduct(code) {

  setResult("🧠 AI analyzing product...");

  let country = document.getElementById("country").value;

  let res = await fetch(`https://world.openfoodfacts.org/api/v0/product/${code}.json`);
  let data = await res.json();

  if (!data.product) {
    setResult("❌ Product not found");
    return;
  }

  let name = data.product.product_name || "Unknown Product";
  let ingredients = (data.product.ingredients_text || "").toLowerCase();

  let result = aiEngine(ingredients, country);

  showResult(name, result, country);
}

// 🧠 AI ENGINE (COUNTRY INCLUDED)
function aiEngine(text, country) {

  const haram = ["pork","bacon","alcohol","lard"];
  const doubtful = ["e471","e120","e542","gelatin","enzymes","flavour"];

  for (let h of haram) {
    if (text.includes(h)) {
      return {
        status: "HARAM",
        icon: "🔴",
        score: 0,
        reason: "Contains: " + h
      };
    }
  }

  let score = 100;
  let reasons = [];

  for (let d of doubtful) {
    if (text.includes(d)) {
      score -= 30;
      reasons.push(d);
    }
  }

  // 🌍 COUNTRY LOGIC RETURN
  let countryNote = "";

  if (country === "us") countryNote = "US regulation check required";
  if (country === "cn") countryNote = "China food system different";
  if (country === "ru") countryNote = "Russia import verification needed";
  if (country === "ae") countryNote = "Gulf halal certification recommended";

  if (score < 70) {
    return {
      status: "SHUBHALI",
      icon: "🟠",
      score,
      reason: reasons.join(", ") + " | " + countryNote
    };
  }

  return {
    status: "HALAL",
    icon: "🟢",
    score,
    reason: "Clean ingredients | " + countryNote
  };
}

// 📌 RESULT UI
function showResult(name, r, country) {

  document.getElementById("result").innerHTML = `
    📦 <b>${name}</b><br><br>
    🌍 Country: ${country}<br><br>
    ${r.icon} <b>${r.status}</b><br>
    📊 Confidence: ${r.score}%<br>
    💡 ${r.reason}
  `;

  if (r.status === "HALAL") {
    showCert(name, r.score);
  } else {
    hideCert();
  }
}

// 📌 SET RESULT
function setResult(text) {
  document.getElementById("result").innerHTML = text;
}

// 🏆 CERTIFICATE
function showCert(name, score) {
  document.getElementById("certificateBox").classList.remove("hidden");

  document.getElementById("certText").innerHTML = `
    ✔ ${name}<br>
    Certified HALAL by AI System<br>
    📊 Confidence: ${score}%
  `;
}

// ❌ HIDE CERT
function hideCert() {
  document.getElementById("certificateBox").classList.add("hidden");
}