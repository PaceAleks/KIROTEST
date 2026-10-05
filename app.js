// Activity Suggester — talks to the appbrewery Bored API from the browser.
const API_BASE = "https://bored-api.appbrewery.com";

const els = {
  type: document.getElementById("type"),
  participants: document.getElementById("participants"),
  price: document.getElementById("price"),
  suggest: document.getElementById("suggest"),
  result: document.getElementById("result"),
  history: document.getElementById("history"),
  historyWrap: document.getElementById("history-wrap"),
};

const PRICE_LABELS = (p) => {
  if (p === 0) return "Free";
  if (p <= 0.3) return "Cheap";
  if (p <= 0.6) return "Moderate";
  return "Pricey";
};

const history = [];

/** Build the request URL from the current filter selections. */
function buildUrl() {
  const type = els.type.value;
  const participants = els.participants.value;
  const price = els.price.value;

  // No filters -> use the simple random endpoint.
  if (!type && !participants && !price) {
    return `${API_BASE}/random`;
  }

  const params = new URLSearchParams();
  if (type) params.set("type", type);
  if (participants) params.set("participants", participants);
  if (price) {
    params.set("minprice", "0");
    params.set("maxprice", price);
  }
  return `${API_BASE}/filter?${params.toString()}`;
}

async function fetchActivity() {
  const url = buildUrl();
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`The activity service returned ${res.status}.`);
  }
  const data = await res.json();

  // /filter returns an array; /random returns a single object.
  if (Array.isArray(data)) {
    if (data.length === 0) {
      throw new Error("No activities matched those filters. Try loosening them.");
    }
    return data[Math.floor(Math.random() * data.length)];
  }
  if (data && data.error) {
    throw new Error("No activities matched those filters. Try loosening them.");
  }
  return data;
}

function renderLoading() {
  els.result.innerHTML = `<div class="message"><div class="spinner"></div></div>`;
}

function renderError(msg) {
  els.result.innerHTML = `<div class="message error">${escapeHtml(msg)}</div>`;
}

function renderActivity(a) {
  const chips = [
    a.type ? `<span class="chip"><strong>Type</strong> ${escapeHtml(a.type)}</span>` : "",
    a.participants != null ? `<span class="chip"><strong>People</strong> ${a.participants}</span>` : "",
    a.price != null ? `<span class="chip"><strong>Cost</strong> ${PRICE_LABELS(a.price)}</span>` : "",
    a.duration ? `<span class="chip"><strong>Duration</strong> ${escapeHtml(a.duration)}</span>` : "",
    a.kidFriendly != null ? `<span class="chip"><strong>Kid friendly</strong> ${a.kidFriendly ? "Yes" : "No"}</span>` : "",
    a.accessibility ? `<span class="chip"><strong>Accessibility</strong> ${escapeHtml(a.accessibility)}</span>` : "",
  ].filter(Boolean).join("");

  const link = a.link
    ? `<a class="link" href="${encodeURI(a.link)}" target="_blank" rel="noopener">Learn more →</a>`
    : "";

  els.result.innerHTML = `
    <div class="card">
      <p class="activity-text">${escapeHtml(a.activity)}</p>
      <div class="chips">${chips}</div>
      ${link}
    </div>`;

  addToHistory(a.activity);
}

function addToHistory(text) {
  if (!text) return;
  history.unshift(text);
  if (history.length > 5) history.pop();
  els.historyWrap.hidden = history.length === 0;
  els.history.innerHTML = history.map((t) => `<li>${escapeHtml(t)}</li>`).join("");
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

async function onSuggest() {
  els.suggest.disabled = true;
  renderLoading();
  try {
    const activity = await fetchActivity();
    renderActivity(activity);
  } catch (err) {
    renderError(err.message || "Something went wrong. Please try again.");
  } finally {
    els.suggest.disabled = false;
  }
}

els.suggest.addEventListener("click", onSuggest);

// Welcome message.
els.result.innerHTML = `<div class="message">Pick some filters (or none) and hit the button.</div>`;
