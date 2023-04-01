// Récupère les données de mon stockage local
let canapLocalStorage = JSON.parse(localStorage.getItem("cart"));
console.log(canapLocalStorage);

//Fonction de mise à jour du panier du prix et de la quantité
function updateCart() {
  // Met à jour le stockage local
  localStorage.setItem("cart", JSON.stringify(canapLocalStorage));

  // Met à jour la quantité totale
  const totalQuantityElement = document.querySelector("#totalQuantity");
  totalQuantityElement.innerHTML = getTotalQuantity();

  // Met à jour le prix total
  const totalPriceElement = document.querySelector("#totalPrice");
  totalPriceElement.innerHTML = getTotalPrice();
}

function displayCartItem() {
  if (canapLocalStorage === null || canapLocalStorage == 0) {
    const positionEmptyCart = document.getElementById("cart__items");
    const emptyCart = `Votre panier est vide`;
    positionEmptyCart.innerHTML = emptyCart;
  } else {
  for (i = 0; i < canapLocalStorage.length; i++) {
    cartItem = canapLocalStorage[i];
    fetch("http://localhost:3000/api/products/" + cartItem.idKanap)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        
          document.getElementById(
            "cart__items"
          ).innerHTML = `<article class="cart__item" data-id=${cartItem.idKanap} data-color="${cartItem.colorKanap}">
        <div class="cart__item__img">
            <img src=${data.imageUrl} alt=${data.altTxt}>
            <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${cartItem.colorKanap}</p>
                    <p>${data.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${cartItem.quantityKanap}>
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
        </article>`;
      
      })
      .catch((error) => console.log("Erreur : " + error));
  }}
}
displayCartItem();

// Fonction pour montrer la quantité totale
function getTotalQuantity() {
  const totalQuantity = document.getElementById("totalQuantity");
  let total = 0;

  canapLocalStorage.forEach(product => {
    total += product.quantityKanap
  })
  totalQuantity.textContent = total
}
getTotalQuantity();

// Fonction pour montrer le prix total
function getTotalPrice(){
  const totalPrice = document.getElementById("totalPrice")
  let total = 0;

  canapLocalStorage.forEach(data => {
    const urlApi = "http://localhost:3000/api/products/";
    fetch(urlApi + data.idKanap)
    .then(res => res.json())
    .then(product => {
      const totalUnitPrice = product.price * cartItem.quantityKanap
      total += totalUnitPrice
      totalPrice.textContent = total
    })
  })
}
getTotalPrice();

// Fonction pour supprimer un élément du panier
function deleteCartItem(event) {
  const buttonClicked = event.target;
  const articleToRemove = buttonClicked.closest(".cart__item");
  const idToRemove = articleToRemove.getAttribute("data-id");
  const colorToRemove = articleToRemove.getAttribute("data-color");

  canapLocalStorage = canapLocalStorage.filter(
    (item) => item.idKanap !== idToRemove || item.colorKanap !== colorToRemove
  );

  updateCart();
  displayCartItem();
  getTotalPrice();
  getTotalQuantity();
}
const cartItemsElement = document.querySelector("#cart__items");
cartItemsElement.addEventListener("click", deleteCartItem);
