let allAccounts = [
  {
    provider: "Mail.ru old",
    quantity: "4141241",
    price: "$0.19",
    hot: true,
    sale: false,
    newOffers: true,
    attribute: "fb_marketplace",
  },
  {
    provider: "Mail.ru Mix",
    quantity: "23525",
    price: "$0.15",
    hot: false,
    sale: true,
    newOffers: true,
    attribute: "yahoo",
  },
  {
    provider: "Mail.ru Biz",
    quantity: "723",
    price: "$0.14",
    hot: true,
    sale: true,
    newOffers: false,
    attribute: "yahoo",
  },
  {
    provider: "Gmail.com PVA",
    quantity: "234",
    price: "$0.12",
    hot: true,
    sale: false,
    newOffers: true,
    attribute: "google_voice",
  },
  {
    provider: "Global 2017",
    quantity: "1200",
    price: "$0.11",
    hot: true,
    sale: false,
    newOffers: false,
    attribute: "fb_marketplace",
  },
  {
    provider: "Gmail.com PVA",
    quantity: "557457",
    price: "$0.09",
    hot: true,
    sale: true,
    newOffers: false,
    attribute: "google_voice",
  },
  {
    provider: "Global 2018",
    quantity: "546",
    price: "$0.17",
    hot: false,
    sale: true,
    newOffers: true,
    attribute: "yahoo",
  },
  {
    provider: "Facebook FP",
    quantity: "903",
    price: "$0.21",
    hot: true,
    sale: false,
    newOffers: true,
    attribute: "fb",
  },
  {
    provider: "Gmail.com PVA",
    quantity: "3",
    price: "$0.18",
    hot: false,
    sale: true,
    newOffers: false,
    attribute: "google_voice",
  },
  {
    provider: "Global 2020",
    quantity: "363",
    price: "$0.19",
    hot: true,
    sale: false,
    newOffers: false,
    attribute: "yahoo",
  },
  {
    provider: "Facebook FP",
    quantity: "82",
    price: "$0.2",
    hot: true,
    sale: true,
    newOffers: false,
    attribute: "fb",
  },
  {
    provider: "Global 2020",
    quantity: "430",
    price: "$0.16",
    hot: true,
    sale: false,
    newOffers: false,
    attribute: "fb_marketplace",
  },
  {
    provider: "Twitter BB",
    quantity: "376",
    price: "$0.22",
    hot: false,
    sale: true,
    newOffers: false,
    attribute: "fb",
    // attribute: "twitter",
  },
  {
    provider: "Mail.ru",
    quantity: "465034",
    price: "$0.15",
    hot: false,
    sale: false,
    newOffers: true,
    attribute: "google",
  },
  {
    provider: "Mail.ru Mix",
    quantity: "23525",
    price: "$0.15",
    hot: true,
    sale: true,
    newOffers: false,
    attribute: "yahoo",
  },
  {
    provider: "Mail.ru Biz",
    quantity: "7236",
    price: "$0.17",
    hot: false,
    sale: true,
    newOffers: false,
    attribute: "hotmail",
  },
  {
    provider: "Twitter IM",
    quantity: "7",
    price: "$0.28",
    hot: true,
    sale: true,
    newOffers: false,
    // attribute: "twitter",
    attribute: "fb",
  },
  {
    provider: "Google.com",
    quantity: "7772",
    price: "$0.11",
    hot: true,
    sale: true,
    newOffers: false,
    attribute: "google",
  },
  {
    provider: "Facebook FP",
    quantity: "63",
    price: "$0.22",
    hot: true,
    sale: false,
    newOffers: false,
    attribute: "fb",
  },
  {
    provider: "Hotmail.com",
    quantity: "726",
    price: "$0.19",
    hot: true,
    sale: true,
    newOffers: false,
    attribute: "hotmail",
  },
];

function createAccuntsListOutput(accountsList) {
  return accountsList
    .map((item) => {
      return `<tr>
  <td>${item.provider}</td>
  <td>${item.quantity}</td>
  <td><span>${item.price}</span> <button class="ab-buy-button">Buy</button>
    <button class="ab-available-button">Not available</button>
</td>
<td class="popup-box-item">
    <div class="ab-account-select-popups">
        <div class="ab-account-select-left-content">
            <h6 class="ab-account-select-title">Gmail.com PVA</h6>
            <p class="ab-description">Accounts are phone verified
                with USA numbers.
                Secret answers are NOT included, recovery e-mails
                are included with
                passwords. US IPs only.
                <br><br>
                Accounts are NOT SUITABLE for Cash App or Google
                Voice creation!
                <br><br>
                Gmail.com Stable USA Plus
            </p>
        </div>
        <div class="ab-account-select-right-content">
            <img src="./assests/image/gmail-icons.svg" width="56"
                height="56" alt="google icons"
                class="account-types-icons">
            <button class="ab-button-style buy-button">Buy</button>
        </div>
    </div>
</td>
</tr>`;
    })
    .reduce((a, b) => a + b, "");
}

let allAccountsOutput = createAccuntsListOutput(allAccounts);

let inputSearch;
const updateInputSearch = () => {
  inputSearch = document.querySelector("#search").value.trim().toLowerCase();
};
updateInputSearch();

let filteredAccounts;
function updateFilteredAccounts() {
  filteredAccounts = allAccounts.filter((account) =>
    account.provider.toLowerCase().includes(inputSearch)
  );
  //   if (filteredAccounts.length === 0) {
  //   noSearch.style.display = "inline-block";
  //   noSearch.style.border = "1px solid red";
  // };
}
updateFilteredAccounts();

function updatePageWithFilteredAccounts(filteredArray) {
  filteredOutput.innerHTML = createAccuntsListOutput(filteredArray);
}
updatePageWithFilteredAccounts(filteredAccounts);
allAccountsList.innerHTML = allAccountsOutput;

search.oninput = function () {
  updateInputSearch();
  updateFilteredAccounts();
  updatePageWithFilteredAccounts(filteredAccounts);
};

//for index.html mouseover activation
function changeBgColor(event) {
  event.target.classList.add("add-bg-color");
}

function changeBgColorBack(event) {
  event.target.classList.remove("add-bg-color");
}

//filtering by Provider
const providerUp = document.querySelector("#providerUp");
providerUp.onclick = function () {
  filteredAccounts = filteredAccounts.sort((a, b) =>
    a.provider.localeCompare(b.provider)
  );
  updatePageWithFilteredAccounts(filteredAccounts);
};

const providerDown = document.querySelector("#providerDown");
providerDown.onclick = function () {
  filteredAccounts = filteredAccounts.sort((a, b) =>
    b.provider.localeCompare(a.provider)
  );
  updatePageWithFilteredAccounts(filteredAccounts);
};

//filtering by Quantity
const quantityUp = document.querySelector("#quantityUp");
quantityUp.onclick = function () {
  filteredAccounts = filteredAccounts.sort((a, b) => a.quantity - b.quantity);
  updatePageWithFilteredAccounts(filteredAccounts);
};

const quantityDown = document.querySelector("#quantityDown");
quantityDown.onclick = function () {
  filteredAccounts = filteredAccounts.sort((a, b) => b.quantity - a.quantity);
  updatePageWithFilteredAccounts(filteredAccounts);
};

//filtering by Price
const priceUp = document.querySelector("#priceUp");
priceUp.onclick = function () {
  filteredAccounts = filteredAccounts.sort(
    (a, b) => a.price.slice(1) - b.price.slice(1)
  );
  updatePageWithFilteredAccounts(filteredAccounts);
};

const priceDown = document.querySelector("#priceDown");
priceDown.onclick = function () {
  filteredAccounts = filteredAccounts.sort(
    (a, b) => b.price.slice(1) - a.price.slice(1)
  );
  updatePageWithFilteredAccounts(filteredAccounts);
};

//working with Attribut-1 buttons

let attrButtonsBlock = document.querySelector(".ab-account-types-list-tabs");
let buttons = attrButtonsBlock.querySelectorAll(".account-tabs-btn");
let attrButtonsArr = Array.from(buttons);
let categoryTabs = document.querySelector(".ab-account-category-tabs");
let categoryBtn = categoryTabs.querySelectorAll(".account-category-btn");
let categoryBtnArr = Array.from(categoryBtn);
let noSearch = document.getElementById('noSearch')
// noSearch.style.display='inline-block';
// noSearch.style.border = '1px solid red'

function activateAttrButton(event) {
  if (event.target.classList.contains("active")) {
    return;
  } else {
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].classList.remove("active");
    }
    event.target.classList.add("active");
  }
}

attrButtonsBlock.addEventListener("click", activateAttrButton);

function filterByAttribute() {
  let activeCategory = categoryBtnArr.find((btn) =>
    btn.classList.contains("active")
  );

  let activeAttribute = attrButtonsArr.find((btn) =>
    btn.classList.contains("active")
  );
  if (activeCategory) {
    let filteredByCategory = allAccounts.filter(
      (acc) => acc[activeCategory.id] === true
    );
    if (activeAttribute.id === "allAcc") {
      return (filteredAccounts = filteredByCategory);
    } else
      return (filteredAccounts = filteredByCategory.filter(
        (acc) => acc.attribute === activeAttribute.id
      ));
  } else if (activeAttribute.id === "allAcc") {
    return (filteredAccounts = allAccounts);
  } else
    return (filteredAccounts = allAccounts.filter(
      (acc) => acc.attribute === activeAttribute.id
    ));
}

attrButtonsBlock.onclick = () => {
  updatePageWithFilteredAccounts(filterByAttribute())
};

allAcc.onclick = () => {
  sale.classList.remove("active");
  hot.classList.remove("active");
  newOffers.classList.remove("active");
  updatePageWithFilteredAccounts(allAccounts);
};

//working with hot/sale/new buttons
hot.onclick = () => {
  let activeAttribute = attrButtonsArr.find((btn) =>
    btn.classList.contains("active")
  );
  if (hot.classList.contains("active")) {
    return;
  } else {
    hot.classList.toggle("active");
    sale.classList.remove("active");
    newOffers.classList.remove("active");
    if (activeAttribute.id === "allAcc") {
      filteredAccounts = allAccounts.filter((acc) => acc.hot === true);
    } else {
      filteredAccounts = allAccounts.filter(
        (acc) => acc.attribute === activeAttribute.id && acc.hot === true
      );
    }
    updatePageWithFilteredAccounts(filteredAccounts);
  }
};

sale.onclick = () => {
  let activeAttribute = attrButtonsArr.find((btn) =>
    btn.classList.contains("active")
  );
  if (sale.classList.contains("active")) {
    return;
  } else {
    sale.classList.toggle("active");
    hot.classList.remove("active");
    newOffers.classList.remove("active");
    if (activeAttribute.id === "allAcc") {
      filteredAccounts = allAccounts.filter((acc) => acc.sale === true);
    } else {
      filteredAccounts = allAccounts.filter(
        (acc) => acc.attribute === activeAttribute.id && acc.sale === true
      );
    }
    updatePageWithFilteredAccounts(filteredAccounts);
  }
};

newOffers.onclick = () => {
  let activeAttribute = attrButtonsArr.find((btn) =>
    btn.classList.contains("active")
  );
  if (newOffers.classList.contains("active")) {
    return;
  } else {
    newOffers.classList.toggle("active");
    hot.classList.remove("active");
    sale.classList.remove("active");
    if (activeAttribute.id === "allAcc") {
      filteredAccounts = allAccounts.filter((acc) => acc.newOffers === true);
    } else {
      filteredAccounts = allAccounts.filter(
        (acc) => acc.attribute === activeAttribute.id && acc.newOffers === true
      );
    }
    updatePageWithFilteredAccounts(filteredAccounts);
  }
};
