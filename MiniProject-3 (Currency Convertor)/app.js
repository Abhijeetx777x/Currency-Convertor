const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies"; // FIXED API URL

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");
const swapIcon = document.querySelector("#swap-icon");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

const updateExchangeRate = async () => {
  let amtVal = amountInput.value;
  if (amtVal === "" || isNaN(amtVal) || amtVal < 0) {
    amtVal = 1;
    amountInput.value = "1";
  }
  
  // FIXED: The new URL only needs the 'from' currency.
  // The endpoint is now: .../usd.json
  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`; 
  
  try {
    let response = await fetch(URL);
    if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
    }
    let data = await response.json();
    
    // The data now returns an object like: { "usd": { "inr": 83.5 } }
    // We access the 'from' currency key, then the 'to' currency key within that.
    let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

    // Flawless check: Format the final amount to two decimal places
    let finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
      console.error("Error fetching data:", error);
      msg.innerText = "Error fetching rate. Please try again.";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`; 
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

const swapCurrencies = () => {
    let tempValue = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempValue;

    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});

swapIcon.addEventListener("click", swapCurrencies);

amountInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/[^0-9.]/g, ''); 
});