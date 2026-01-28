const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

function getBasket() {
  try {
    const basket = localStorage.getItem("basket");
    if (!basket) return [];
    const parsed = JSON.parse(basket);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Error parsing basket from localStorage:", error);
    return [];
  }
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((product) => {
    const item = PRODUCTS[product];
    if (item) {
      const li = document.createElement("li");
      li.innerHTML = `<span class='basket-emoji'>${item.emoji}</span> <span>${item.name}</span>`;
      basketList.appendChild(li);
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};

function getRandomFruit() {
  const fruits = Object.keys(PRODUCTS);
  return fruits[Math.floor(Math.random() * fruits.length)];
}

function spinSlotMachine() {
  const slotReel = document.getElementById("slotReel");
  const spinButton = document.getElementById("spinButton");
  const slotResult = document.getElementById("slotResult");

  if (!slotReel || !spinButton) return;

  // Disable button and clear result during spin
  spinButton.disabled = true;
  slotResult.textContent = "";

  // Animate the reel
  const spinDuration = 1500; // 1.5 seconds
  const startTime = Date.now();
  const fruits = Object.keys(PRODUCTS);

  const spinAnimation = setInterval(() => {
    const elapsed = Date.now() - startTime;
    if (elapsed < spinDuration) {
      // Randomly select a fruit to display during spin
      const randomIndex = Math.floor(Math.random() * fruits.length);
      const fruitKey = fruits[randomIndex];
      slotReel.textContent = PRODUCTS[fruitKey].emoji;
    } else {
      // Stop spinning and select final fruit
      clearInterval(spinAnimation);
      const selectedFruit = getRandomFruit();
      const fruitData = PRODUCTS[selectedFruit];
      
      // Display final result
      slotReel.textContent = fruitData.emoji;
      slotResult.textContent = `You won: ${fruitData.name}!`;
      slotResult.style.color = "#4caf50";

      // Add fruit to basket
      addToBasket(selectedFruit);

      // Re-enable button
      spinButton.disabled = false;
    }
  }, 50);
}
