const showResults = document.getElementById("out-post");
const postProductBtn = document.getElementById("btn-post");
let outputMessage = document.getElementById("outputMessage");
let pendingTimeout = null;
const ul = document.createElement("ul");
showResults.appendChild(ul);

const postReq = async () => {
  try {
    const postData = await fetch("https://dummyjson.com/products/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "Mechanical Keyboard",
        price: 89,
      }),
    });

    if (!postData.ok) {
      throw new Error(
        "There was a problem getting the product requested. Try again.",
      );
    }

    const getData = await postData.json();

    if (!getData.id) {
      renderError();
    }

    console.log(getData);
    renderProduct(getData);
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
  outputMessage.textContent = `${err?.message ? err?.message : ""}: Creation failed — no id returned`;
  outputMessage.className = "output error";
}

postProductBtn.addEventListener("click", () => {
  if (pendingTimeout) clearTimeout(pendingTimeout);
  pendingTimeout = setTimeout(() => {
    postReq();
  }, 500);
});
