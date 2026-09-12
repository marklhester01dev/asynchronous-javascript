const showResults = document.getElementById("out-put");
const postProductBtn = document.getElementById("btn-put");
let outputMessage = document.getElementById("outputMessage");
let pendingTimeout = null;
const ul = document.createElement("ul");
showResults.appendChild(ul);

const updateRes = async (productID) => {
  try {
    if (typeof productID !== "number") {
      renderError();
      return;
    }

    const [productRes, productRequest] = await Promise.all([
      fetch(`https://dummyjson.com/products`),
      fetch(`https://dummyjson.com/products/${productID}`),
    ]);

    if (!productRes.ok || !productRequest.ok) {
      throw new Error("There was a problem retrieving the data. Try again.");
    }

    const [productData, productRequestData] = [
      await productRes.json(),
      await productRequest.json(),
    ];

    const updatePricing = await fetch(
      `https://dummyjson.com/products/${productID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          price: 500.0,
        }),
      },
    );

    if (!updatePricing.ok) {
      throw new Error("There was a problem retrieving the data. Try again.");
    }

    const getUpdatedProductData = await updatePricing.json();

    renderProduct(getUpdatedProductData);
  } catch (err) {
    renderError(err);
  }
};

function renderProduct(productPosted) {
  ul.innerHTML = `<li class="product">
  <h2 class="product__name">${productPosted.title}</h2>
  <p class="product__price">${productPosted.price}</p>
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
    updateRes(2);
  }, 500);
});
