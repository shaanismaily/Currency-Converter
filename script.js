const swap = document.getElementById("swap");
const from = document.getElementById("from");
const to = document.getElementById("to");
const amount = document.getElementById("amount");
const result = document.querySelector(".result");
const lastUpdated = document.querySelector(".last-updated");

let rates = {}; // store currency rates

// Swap currencies
swap.addEventListener("click", () => {
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  convert();
});

// Fetch currencies
function initCurrencies() {
  const api = "https://open.er-api.com/v6/latest/INR";

  fetch(api)
  .then((res) => {
    if (!res.ok) {
      throw new Error("API limit reached or server error");
    }
    return res.json();
  })
  .then((data) => {
    if (!data.rates) {
      throw new Error("Invalid API response");
    }

    rates = data.rates;

    populate(from, Object.keys(rates));
    populate(to, Object.keys(rates));

    from.value = "INR";
    to.value = "USD";

    const updated = data.time_last_update_utc;
    const formattedDate = new Date(updated).toLocaleString("en-IN");

    lastUpdated.textContent = `Last updated: ${formattedDate}`;

    convert();
  })
  .catch((err) => {
    console.error(err);
    result.textContent =
      "⚠️ Currency service temporarily unavailable. Try again later.";
  });
}

function populate(selectElement, currencies) {
  selectElement.innerHTML = "";

  currencies.forEach((curr) => {
    const option = document.createElement("option");
    option.value = curr;
    option.textContent = curr;
    selectElement.appendChild(option);
  });
}

// Conversion logic
function convert() {
  const fromCurrency = from.value;
  const toCurrency = to.value;
  const amountValue = Number(amount.value);

  if (!amountValue) {
    result.textContent = "Enter amount";
    return;
  }

  const converted = amountValue * (rates[toCurrency] / rates[fromCurrency]);

  result.textContent = `${amountValue} ${fromCurrency} = ${converted.toFixed(
    2
  )} ${toCurrency}`;
}

// Event listeners
amount.addEventListener("input", convert);
from.addEventListener("change", convert);
to.addEventListener("change", convert);

// Init
initCurrencies();
