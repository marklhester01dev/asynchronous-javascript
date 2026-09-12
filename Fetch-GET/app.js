const showResults = document.getElementById("out-get");
const getProductsBtn = document.getElementById("btn-get");
let outputMessage = document.getElementById("outputMessage");
let pendingTimeout = null;
const ul = document.createElement("ul");
showResults.appendChild(ul);

const products = async () => {
  try {
    const getProducts = await fetch("https://dummyjson.com/products");

    if (!getProducts.ok) {
      throw new Error(
        "There was a problem reaching the server. Try again later.",
      );
    }

    const productsData = await getProducts.json();
    const filtered = filteredProducts(productsData);

    renderProducts(filtered);
  } catch (err) {
    renderError(err);
  }
};

function delay() {
  return setTimeout(() => {
    products();
  }, 3000);
}

function showWaitingMessage() {
  outputMessage.innerHTML = `<p class="waitingMessage">Getting results. Please wait...</p>`;
}

function filteredProducts(productsData) {
  return productsData.products.filter((product) => product.price > 50.0);
}

function renderProducts(filteredData) {
  ul.className = "productList output success";

  ul.innerHTML = filteredData
    .map((data) => {
      return `<li class="product">
    <h3 class="product__title">${data.title}</h3>
    <p class="product__description">${data.description}</p>
    <span class="product__price">${data.price}</span>
    </li>`;
    })
    .join("");

  outputMessage.textContent = "";
}

function renderError(err) {
  ul.textContent = `${err?.message ? err.message : ""}: There was a problem rendering the products. Try again.`;
  ul.className = "output error";

  outputMessage.textContent = "";
}

getProductsBtn.addEventListener("click", () => {
  showWaitingMessage();
  if (pendingTimeout) clearTimeout(pendingTimeout);
  pendingTimeout = setTimeout(() => {
    products();
  }, 3000);
});
