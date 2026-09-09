const inputProduct = document.getElementById("query");
const resultsList = document.getElementById("results");

let latestRequestId = 0;

const searchProduct = async (inputValue) => {
  const requestId = ++latestRequestId; // ticket for this specific call

  showWaitingMessage(inputValue);

  try {
    const findSearchedProduct = await fetch(
      `https://dummyjson.com/products/search?q=${inputValue}`,
    );

    if (findSearchedProduct.status === 404 || !findSearchedProduct.ok) {
      throw new Error("Cannot get the searched product. Try again later.");
    }

    const getSearchedProduct = await findSearchedProduct.json();

    // Only render if no newer search has started since this one began
    if (requestId === latestRequestId) {
      renderProducts(getSearchedProduct);
    }
  } catch (err) {
    if (requestId === latestRequestId) {
      renderError(err);
    }
  }
};

function showWaitingMessage(query) {
  resultsList.innerHTML = `<li class="waiting"><p>Searching for ${query}. Please wait...</p></li>`;
}

function renderProducts(searchedProduct) {
  resultsList.innerHTML = searchedProduct.products
    .map((product) => {
      return `
    <li class="productInfo">
      <p class="productTitle" id="${product.id}">${product.title}</p>
      <p class="productDescription">${product.description}</p>
      <p class="productPrice">$${product.price}</p>
    </li>
    `;
    })
    .join("");
}

function renderError(error = null) {
  resultsList.innerHTML = `<li><p class="error">Cannot get the products. Try again later. ${
    error?.message ?? ""
  }</p></li>`;
}

function debounce(fn, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

const handleSearch = debounce((value) => {
  searchProduct(value);
}, 500);

inputProduct.addEventListener("input", (event) => {
  handleSearch(event.target.value);
});
