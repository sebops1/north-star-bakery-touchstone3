"use strict";

const menuItems = [
  { id: "country-sourdough", name: "Country Sourdough", category: "bread", description: "Naturally leavened loaf with a crisp crust.", price: "$8" },
  { id: "seeded-wheat", name: "Seeded Wheat", category: "bread", description: "Hearty sandwich loaf with sunflower and sesame seeds.", price: "$7" },
  { id: "morning-bun", name: "Cinnamon Morning Bun", category: "pastry", description: "Buttery laminated pastry with cinnamon sugar.", price: "$4" },
  { id: "berry-scone", name: "Seasonal Berry Scone", category: "pastry", description: "Tender scone made with the season's fruit.", price: "$4" },
  { id: "celebration-cake", name: "Celebration Cake", category: "cake", description: "Simple custom cake for a small gathering.", price: "from $35" },
  { id: "carrot-cake", name: "Carrot Spice Cake", category: "cake", description: "Moist cake with cream cheese frosting.", price: "$38" }
];

const storageKeys = {
  favorites: "northStarFavorites",
  customer: "northStarCustomer"
};

const categoryLabels = {
  all: "all bakery items",
  bread: "breads",
  pastry: "pastries",
  cake: "cakes"
};

const validationMessages = {
  name: "Please enter at least two characters for your name.",
  email: "Please enter a valid email address, such as name@example.com.",
  pickupDate: "Please choose a preferred pickup date.",
  details: "Please include at least 10 characters so we can understand your request."
};

function getFavorites() {
  return JSON.parse(localStorage.getItem(storageKeys.favorites) || "[]");
}

function saveFavorites(favorites) {
  localStorage.setItem(storageKeys.favorites, JSON.stringify(favorites));
}

function updateSavedSummary() {
  const summary = document.querySelector("#saved-summary");
  if (!summary) return;
  const favorites = getFavorites();
  summary.textContent = favorites.length === 0
    ? "No favorites saved yet."
    : `${favorites.length} favorite${favorites.length === 1 ? "" : "s"} saved for your next visit.`;
}

function renderProducts(category = "all") {
  const results = document.querySelector("#product-results");
  if (!results) return;
  const favorites = getFavorites();
  const visibleItems = category === "all" ? menuItems : menuItems.filter((item) => item.category === category);
  results.innerHTML = `<p class="filter-result">Showing ${categoryLabels[category]}.</p>` + visibleItems.map((item) => {
    const isFavorite = favorites.includes(item.id);
    return `<article class="product-card"><h3>${item.name}</h3><p>${item.description}</p><p><strong>${item.price}</strong></p><button type="button" class="favorite-button" data-id="${item.id}" aria-pressed="${isFavorite}">${isFavorite ? "Saved favorite" : "Save favorite"}</button></article>`;
  }).join("");
}

function toggleFavorite(itemId) {
  const favorites = getFavorites();
  const nextFavorites = favorites.includes(itemId)
    ? favorites.filter((id) => id !== itemId)
    : [...favorites, itemId];
  saveFavorites(nextFavorites);
  const selected = document.querySelector(".filter-button.is-selected");
  renderProducts(selected ? selected.dataset.category : "all");
  updateSavedSummary();
}

function setupMenuExplorer() {
  const results = document.querySelector("#product-results");
  if (!results) return;
  renderProducts();
  updateSavedSummary();
  document.querySelectorAll(".filter-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-button").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      renderProducts(button.dataset.category);
    });
  });
  results.addEventListener("click", (event) => {
    const button = event.target.closest(".favorite-button");
    if (button) toggleFavorite(button.dataset.id);
  });
}

function showError(fieldId, message) {
  document.querySelector(`#${fieldId}-error`).textContent = message;
}

function clearErrors() {
  document.querySelectorAll(".field-message").forEach((message) => { message.textContent = ""; });
  document.querySelector("#form-status").textContent = "";
}

function saveCustomerDetails(name, email) {
  localStorage.setItem(storageKeys.customer, JSON.stringify({ name, email }));
}

function restoreCustomerDetails() {
  const customer = JSON.parse(localStorage.getItem(storageKeys.customer) || "null");
  if (!customer) return;
  document.querySelector("#name").value = customer.name || "";
  document.querySelector("#email").value = customer.email || "";
  document.querySelector("#form-status").textContent = "Welcome back. Your contact details were remembered.";
}

function setupPreorderForm() {
  const form = document.querySelector("#preorder-form");
  if (!form) return;
  restoreCustomerDetails();
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors();
    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const pickupDate = document.querySelector("#pickup-date").value;
    const details = document.querySelector("#item-details").value.trim();
    let isValid = true;
    if (name.length < 2) { showError("name", validationMessages.name); isValid = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showError("email", validationMessages.email); isValid = false; }
    if (!pickupDate) { showError("pickup-date", validationMessages.pickupDate); isValid = false; }
    if (details.length < 10) { showError("item-details", validationMessages.details); isValid = false; }
    if (!isValid) return;
    saveCustomerDetails(name, email);
    document.querySelector("#form-status").textContent = "Request looks good. Your name and email will be remembered for your next visit.";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMenuExplorer();
  setupPreorderForm();
});
