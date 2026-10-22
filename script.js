
const form = document.getElementById("url-form");
const input = document.getElementById("url-input");
const errorBox = document.getElementById("input-error");
const results = document.getElementById("results");
const historyList = document.getElementById("history-list");

let analysisHistory = [];

function analyzeURL(rawURL) {
  const findings = [];
  let score = 0;

  const url = new URL(rawURL);
  const hostname = url.hostname.toLowerCase();
  const fullURL = rawURL.toLowerCase();
  const labels = hostname.split(".");

  function flag(condition, points, message) {
    if (condition) {
      score += points;
      findings.push(message);
    }
  }

  flag(url.protocol !== "https:", 15,
    "The URL does not use HTTPS. Data may not be encrypted in transit.");

  flag(url.username !== "" || url.password !== "", 25,
    "The URL contains user-information fields before the hostname, which can disguise the actual destination.");

  flag(/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname), 20,
    "The hostname is an IPv4 address rather than a conventional domain name.");

  flag(hostname.includes("xn--"), 20,
    "The hostname contains an internationalized domain label that deserves careful inspection.");

  flag(hostname.split(".").length > 4, 10,
    "The hostname contains many subdomain levels.");

  flag(hostname.length > 50, 10,
    "The hostname is unusually long.");

  flag(fullURL.length > 100, 10,
    "The complete URL is unusually long.");

  flag((hostname.match(/-/g) || []).length >= 3, 10,
    "The hostname contains several hyphens.");

  flag(/login|signin|verify|account|password|secure|update|wallet/i.test(fullURL), 10,
    "The URL contains words commonly associated with login or account-verification pages. These words can also appear on legitimate websites.");

  flag(/@/.test(url.href), 10,
    "The URL contains an @ symbol, which can make a destination harder to interpret.");

  flag(/%[0-9a-f]{2}/i.test(url.pathname + url.search), 5,
    "The path or query contains percent-encoded characters.");

  flag(/\.(zip|mov)(\/|$)/i.test(url.pathname), 10,
    "The URL path ends with a file extension sometimes used in deceptive link campaigns.");

  score = Math.min(score, 100);

  if (findings.length === 0) {
    findings.push(
      "No configured warning patterns were detected. This does not prove that the website is safe."
    );
  }

  let level;
  if (score >= 50) {
    level = "high";
  } else if (score >= 25) {
    level = "medium";
  } else {
    level = "low";
  }

  return {
    url: url.href,
    hostname,
    protocol: url.protocol,
    score,
    level,
    findings
  };
}

function showAnalysis(data) {
  results.hidden = false;

  document.getElementById("risk-score").textContent = data.score;
  document.getElementById("score-fill").style.width = data.score + "%";

  const badge = document.getElementById("verdict-badge");
  badge.textContent = data.level.toUpperCase() + " RISK";
  badge.className = "verdict-badge " + data.level;

  const riskLabel = document.getElementById("risk-label");
  riskLabel.textContent = {
    low: "Lower observed risk",
    medium: "Caution advised",
    high: "Multiple warning indicators"
  }[data.level];

  document.getElementById("normalized-url").textContent = data.url;
  document.getElementById("hostname").textContent = data.hostname;
  document.getElementById("protocol").textContent = data.protocol;
  document.getElementById("indicator-summary").textContent =
    data.findings.length + " observation(s) recorded by the local rules.";

  const list = document.getElementById("indicator-list");
  list.replaceChildren();

  data.findings.forEach((finding) => {
    const item = document.createElement("li");
    const icon = document.createElement("span");
    const message = document.createElement("span");

    icon.className = "indicator-icon";
    icon.textContent = data.score === 0 ? "✓" : "!";
    message.textContent = finding;

    if (data.score === 0) item.classList.add("safe");

    item.append(icon, message);
    list.appendChild(item);
  });
}

function renderHistory() {
  historyList.replaceChildren();

  if (analysisHistory.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No URLs analyzed yet. Start with the analyzer above.";
    historyList.appendChild(empty);
    return;
  }

  analysisHistory.forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";

    const address = document.createElement("div");
    address.className = "history-url";
    address.textContent = item.hostname;

    const meta = document.createElement("div");
    meta.className = "history-meta";

    const score = document.createElement("strong");
    score.className = item.level + "-text";
    score.textContent = item.score + "/100 · " + item.level.toUpperCase();

    const date = document.createElement("span");
    date.textContent = item.time;

    meta.append(score, date);
    row.append(address, meta);
    historyList.appendChild(row);
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  errorBox.hidden = true;

  let rawURL = input.value.trim();

  if (!rawURL) {
    errorBox.textContent = "Please enter a URL.";
    errorBox.hidden = false;
    return;
  }

  if (!/^https?:\/\//i.test(rawURL)) {
    rawURL = "https://" + rawURL;
  }

  let parsed;
  try {
    parsed = new URL(rawURL);
  } catch {
    errorBox.textContent = "Invalid URL format. Please check the address.";
    errorBox.hidden = false;
    return;
  }

  if (!["http:", "https:"].includes(parsed.protocol) ||
      !parsed.hostname.includes(".") ||
      parsed.hostname.startsWith(".") ||
      parsed.hostname.endsWith(".") ||
      parsed.hostname.includes("..") ||
      /\s/.test(parsed.hostname)) {
    errorBox.textContent = "Enter a valid HTTP or HTTPS website URL.";
    errorBox.hidden = false;
    return;
  }

  const data = analyzeURL(rawURL);
  showAnalysis(data);

  analysisHistory.unshift({
    hostname: data.hostname,
    score: data.score,
    level: data.level,
    time: new Date().toLocaleTimeString()
  });

  analysisHistory = analysisHistory.slice(0, 5);
  renderHistory();
  results.scrollIntoView({ behavior: "smooth", block: "start" });
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.example;
    form.requestSubmit();
  });
});

document.getElementById("clear-history").addEventListener("click", () => {
  analysisHistory = [];
  renderHistory();
});
