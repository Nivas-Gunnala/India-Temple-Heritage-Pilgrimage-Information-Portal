const temples = {
  meenakshi: {title:"Meenakshi Amman Temple", location:"Madurai, Tamil Nadu", deity:"Meenakshi Sundareshwar", description:"A celebrated historic temple complex in Madurai, known for its colourful gopurams, intricate sculpture, and rich ritual traditions.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Meenakshi_Temple%2C_Gopuram%2C_Madurai%2C_India.jpg/960px-Meenakshi_Temple%2C_Gopuram%2C_Madurai%2C_India.jpg"},
  kashi: {title:"Kashi Vishwanath Temple", location:"Varanasi, Uttar Pradesh", deity:"Lord Shiva", description:"One of the most revered Shiva temples, located in the ancient city of Varanasi near the sacred Ganges. Visitors should check official guidance before travelling.", image:"https://thumb.wikimedia.org/wikipedia/commons/thumb/e/ee/View_of_the_ghats_at_Varanasi.jpg/960px-View_of_the_ghats_at_Varanasi.jpg"},
  jagannath: {title:"Jagannath Temple", location:"Puri, Odisha", deity:"Lord Jagannath", description:"A major pilgrimage destination with distinctive daily traditions and the celebrated annual Rath Yatra. Access rules and schedules may vary.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Jagannath_Temple_Puri.jpg/960px-Jagannath_Temple_Puri.jpg"},
  tirumala: {title:"Tirumala Venkateswara Temple", location:"Tirumala, Andhra Pradesh", deity:"Lord Venkateswara", description:"A prominent pilgrimage centre in the Seshachalam Hills. Darshan arrangements can be time-sensitive, so consult the official TTD website for current procedures.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Tirumala_Venkateswara_Temple%2C_Tirupati_%2823710086864%29.jpg/960px-Tirumala_Venkateswara_Temple%2C_Tirupati_%2823710086864%29.jpg"},
  virupaksha: {title:"Virupaksha Temple", location:"Hampi, Karnataka", deity:"Lord Shiva", description:"A living temple in the historic landscape of Hampi, associated with the Vijayanagara period and renowned for its architectural and cultural significance.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Virupaksha_temple_hampi.jpg/960px-Virupaksha_temple_hampi.jpg"},
  trimbakeshwar: {title:"Trimbakeshwar Temple", location:"Nashik, Maharashtra", deity:"Lord Shiva", description:"A significant Jyotirlinga shrine near the Brahmagiri hills and the Godavari's source region. Confirm local schedules and visitor guidance before arrival.", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Trimbakeshwar_temple.jpg/960px-Trimbakeshwar_temple.jpg"}
};

const grid = document.getElementById("templeGrid");
const cards = [...document.querySelectorAll(".temple-card")];
const searchInput = document.getElementById("searchInput");
const stateFilter = document.getElementById("stateFilter");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const dialog = document.getElementById("templeDialog");
const toast = document.getElementById("toast");
let activeCategory = "All";
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function getSaved() {
  try { return JSON.parse(localStorage.getItem("sacredIndiaSaved") || "[]"); }
  catch { return []; }
}
function setSaved(list) {
  try { localStorage.setItem("sacredIndiaSaved", JSON.stringify(list)); } catch {}
}
function refreshSavedButtons() {
  const saved = getSaved();
  document.querySelectorAll("[data-save]").forEach(button => {
    const isSaved = saved.includes(button.dataset.save);
    button.classList.toggle("saved", isSaved);
    button.textContent = isSaved ? "♥" : "♡";
    button.setAttribute("aria-pressed", String(isSaved));
  });
}
function toggleSaved(id) {
  const saved = getSaved();
  const exists = saved.includes(id);
  setSaved(exists ? saved.filter(item => item !== id) : [...saved, id]);
  refreshSavedButtons();
  const name = temples[id]?.title || "Temple";
  showToast(exists ? `${name} removed from saved places.` : `${name} saved to your favourites.`);
  const dialogSave = document.getElementById("dialogSave");
  if (dialogSave.dataset.current === id) dialogSave.textContent = getSaved().includes(id) ? "♥ Saved to favourites" : "♡ Save this temple";
}

function filterCards() {
  const query = searchInput.value.trim().toLowerCase();
  const state = stateFilter.value;
  let shown = 0;
  cards.forEach(card => {
    const searchable = `${card.dataset.name} ${card.dataset.city} ${card.dataset.state} ${card.dataset.deity}`.toLowerCase();
    const categoryMatch = activeCategory === "All" || card.dataset.categories.split(" ").includes(activeCategory);
    const visible = searchable.includes(query) && (!state || card.dataset.state === state) && categoryMatch;
    card.hidden = !visible;
    if (visible) shown++;
  });
  resultCount.textContent = `Showing ${shown} destination${shown === 1 ? "" : "s"}`;
  emptyState.hidden = shown !== 0;
  grid.hidden = shown === 0;
}
document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();
  filterCards();
  document.getElementById("explore").scrollIntoView({behavior:"smooth"});
});
searchInput.addEventListener("input", filterCards);
stateFilter.addEventListener("change", filterCards);
document.getElementById("filterChips").addEventListener("click", event => {
  const chip = event.target.closest("[data-filter]");
  if (!chip) return;
  activeCategory = chip.dataset.filter;
  document.querySelectorAll(".chip").forEach(item => item.classList.toggle("active", item === chip));
  filterCards();
});
document.getElementById("clearFilters").addEventListener("click", () => {
  searchInput.value = "";
  stateFilter.value = "";
  activeCategory = "All";
  document.querySelectorAll(".chip").forEach(item => item.classList.toggle("active", item.dataset.filter === "All"));
  filterCards();
});
document.getElementById("showAllButton").addEventListener("click", () => {
  document.getElementById("clearFilters").click();
  showToast("You're viewing all featured destinations.");
});

function openTemple(id) {
  const temple = temples[id];
  if (!temple) return;
  document.getElementById("dialogTitle").textContent = temple.title;
  document.getElementById("dialogLocation").textContent = `⌖ ${temple.location.toUpperCase()}`;
  document.getElementById("dialogDescription").textContent = temple.description;
  document.getElementById("dialogDeity").textContent = temple.deity;
  document.getElementById("dialogImage").style.backgroundImage = `url("${temple.image}")`;
  const saveButton = document.getElementById("dialogSave");
  saveButton.dataset.current = id;
  saveButton.textContent = getSaved().includes(id) ? "♥ Saved to favourites" : "♡ Save this temple";
  if (typeof dialog.showModal === "function") dialog.showModal();
  else dialog.setAttribute("open", "");
}
grid.addEventListener("click", event => {
  const detail = event.target.closest("[data-detail]");
  const save = event.target.closest("[data-save]");
  if (detail) openTemple(detail.dataset.detail);
  if (save) toggleSaved(save.dataset.save);
});
document.getElementById("dialogClose").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });
document.getElementById("dialogSave").addEventListener("click", event => {
  if (event.currentTarget.dataset.current) toggleSaved(event.currentTarget.dataset.current);
});

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
menuToggle.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
});
mainNav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  mainNav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
}));

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  const email = document.getElementById("emailInput");
  if (!email.checkValidity()) { email.reportValidity(); return; }
  document.getElementById("newsletterMessage").textContent = "Thank you — this demo has recorded your interest locally for this session.";
  email.value = "";
  showToast("Thank you for joining the Sacred India community.");
});

document.getElementById("year").textContent = new Date().getFullYear();
refreshSavedButtons();
filterCards();
