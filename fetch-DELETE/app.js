const showResults = document.getElementById("out-delete");
const postProductBtn = document.getElementById("btn-delete");
let outputMessage = document.getElementById("outputMessage");
let pendingTimeout = null;
const ul = document.createElement("ul");
showResults.appendChild(ul);
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const deleteRes = async (productID) => {
  let currentDate = new Date();
  try {
    if (typeof productID !== "number") {
      renderError(new Error("Product ID must be a number."));
      return;
    }

    const productRequest = await fetch(
      `https://dummyjson.com/products/${productID}`,
      {
        method: "DELETE",
      },
    );

    if (!productRequest.ok) {
      throw new Error("There was a problem retrieving the data. Try again.");
    }

    const productData = await productRequest.json();

    renderProduct(productData, currentDate, days);
  } catch (err) {
    renderError(err);
  }
};

function renderProduct(productDeleted, date, days) {
  ul.innerHTML = `<li class="product">
  <p class="product__detail">Deleted "${productDeleted.title}" (id: ${productDeleted.id}) at ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}, ${days[date.getDay()]} ,${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>
  </li>`;
  ul.className = "output success";

  outputMessage.textContent = "";
}

function renderError(err = null) {
  outputMessage.textContent = `${err?.message ? err?.message : ""}`;
  outputMessage.className = "output error";
}

postProductBtn.addEventListener("click", () => {
  if (pendingTimeout) clearTimeout(pendingTimeout);
  pendingTimeout = setTimeout(() => {
    deleteRes(2);
  }, 500);
});
