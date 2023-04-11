// Récupère les données de mon stockage local
let canapLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];

// On sauvegarde l'url de notrer api dans une variable
const urlApi = "http://localhost:3000/api/products/";

//Fonction de mise à jour du panier du prix et de la quantité
function updateCart() {
  // Met à jour le stockage local
  localStorage.setItem("cart", JSON.stringify(canapLocalStorage));

  // Met à jour la quantité totale sur la page
  document.querySelector("#totalQuantity").innerHTML = getTotalQuantity();

  // Met à jour le prix total sur la page
  document.querySelector("#totalPrice").innerHTML = getTotalPrice();
}

function callApi() {
  // Requête à l'api avec une fonction map pour parcourir chaque élément de notre panier
  const requestsProducts = canapLocalStorage.map(async (cartItem) => {
    try {
      const res = await fetch(
        urlApi + cartItem.idKanap // Création une nouvelle url d'api en utilisant l'ID 'idKanap' et on appelle cette url avec fetch()
      );
      const data = await res.json();
      return data;
    } catch (error) {
      return alert("Erreur : " + error);
    }
  });

  // On appelle cette méthode lorsque toutes les requêtes se sont bien passées
  Promise.all(requestsProducts)
    .then((products) => {
      products.forEach((product, index) => {
        // On appelle un tableau avec tous les produits ajoutés dans le local storage
        canapLocalStorage[index].productId = product._id;
      });
      displayCart();
    })
    .catch((error) => alert("Erreur : " + error));
}
callApi();

async function displayCart() {
  // On vérifie que le local storage soit plein ou non
  if (canapLocalStorage == 0 || canapLocalStorage === null) {
    const positionEmptyCart = document.getElementById("cart__items");
    const emptyCart = `Votre panier est vide`;
    positionEmptyCart.innerHTML = emptyCart;
    const orderButton = document.querySelector("#order");
    orderButton.disabled = true;
    orderButton.style.backgroundColor = "grey";
    orderButton.style.cursor = "not-allowed";
  } else {
    // Si le local storage est plein affiche les éléments dans le DOM
    document.getElementById("cart__items").innerHTML = ""; // On vide le DOM
    // On boucle a travers les élément stockés dans le local storage
    for (cart in canapLocalStorage) {
      // On récupère l'ID des produits
      const productId = canapLocalStorage[cart].productId;
      // A l'aide de l'url de l'api et de l'id on récupère le détails des produits
      try {
        const res = await fetch(urlApi + productId);
        const product = await res.json();
        // Une fois les informations reçues du local storage et de l'api on insère nos éléments dans le DOM
        document.getElementById(
          "cart__items"
        ).innerHTML += `<article class="cart__item" data-id=${canapLocalStorage[cart].idKanap} data-color="${canapLocalStorage[cart].colorKanap}">
      <div class="cart__item__img">
          <img src=${product.imageUrl} alt=${product.altTxt}>
          <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>${product.name}</h2>
                  <p>${canapLocalStorage[cart].colorKanap}</p>
                  <p>${product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${canapLocalStorage[cart].quantityKanap}>
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                  </div>
                </div>
              </div>
      </article>`;
      } catch (error) {
        alert(error);
      }
    }
    deleteCanap();
    changeQuantity();
    getTotalPrice();
    getTotalQuantity();
    updateCart();
  }
}

// Supprimer un produit du panier
function deleteCanap() {
  const deleteButtons = document.querySelectorAll(".deleteItem");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const article = event.target.closest("article");
      const id = article.getAttribute("data-id");
      const color = article.querySelector("p").textContent;

      //Supprime l'article en fonction de son ID et de sa couleur
      canapLocalStorage.forEach((item, index) => {
        if (item.idKanap === id && item.colorKanap === color) {
          canapLocalStorage.splice(index, 1);

          // Mise à jour du panier, du prix total et de la quantité
          updateCart();

          // Retire l'élément du DOM
          article.remove();

          // Si le Local Storage est vide, exécute cette condition
          if (canapLocalStorage.length === 0) {
            const positionEmptyCart = document.getElementById("cart__items");
            const emptyCart = `<p>Vous n'avez plus d'articles dans le panier</p>`;
            positionEmptyCart.innerHTML = emptyCart;

            // Si le panier est vide, le bouton de commande sera grisé
            const orderButton = document.querySelector("#order");
            orderButton.disabled = true;
            orderButton.style.backgroundColor = "grey";
            orderButton.style.cursor = "not-allowed";
          }
        }
      });
    });
  });
}

// Affiche le prix total
function getTotalPrice() {
  let totalPrice = 0;

  // On parcours notre tableau qui contient les produits ajoutés
  for (let i = 0; i < canapLocalStorage.length; i++) {
    const productId = canapLocalStorage[i].productId;
    const productPrice = canapLocalStorage[i].productPrice;

    // Si le prix est bien définit on calcul le prix
    if (productPrice !== undefined) {
      totalPrice += productPrice * canapLocalStorage[i].quantityKanap;
    } else {
      // Sinon on envoie une requête à l'api pour vérifier le prix et faire le calcul
      try {
        fetch(urlApi + productId)
          .then((res) => res.json())
          .then((data) => {
            // On extrait le prix de la réponse
            const price = data.price;
            // On stock le prix pour éviter de refaire une requête pour le même produit
            canapLocalStorage[i].productPrice = price;
            totalPrice += price * canapLocalStorage[i].quantityKanap;
            // On met à jour notrre affichage
            const totalPriceElement = document.querySelector("#totalPrice");
            totalPriceElement.innerHTML = totalPrice;
          });
      } catch (error) {
        alert("Erreur : " + error);
      }
    }
  }
  return totalPrice;
}

// Affiche la quantité totale
function getTotalQuantity() {
  let totalQuantity = 0;
  canapLocalStorage.forEach((item) => {
    totalQuantity += item.quantityKanap;
  });
  return totalQuantity;
}

//Gestion de la quantité
function changeQuantity() {
  const quantityInputs = document.querySelectorAll(".itemQuantity");
  quantityInputs.forEach((input) => {
    input.addEventListener("change", (event) => {
      const newQuantity = parseInt(event.target.value);
      const article = event.target.closest("article");
      const id = article.getAttribute("data-id");
      const color = article.querySelector("p").textContent;

      // Trouver l'élément correspondant dans le stockage local
      const itemIndex = canapLocalStorage.findIndex(
        (item) => item.idKanap === id && item.colorKanap === color
      );
      const item = canapLocalStorage[itemIndex];

      // Mettre à jour la quantité dans le stockage local
      // Avec une condition pour vérifier la validité de la quantité
      if (newQuantity > 0 && newQuantity <= 100) {
        item.quantityKanap = newQuantity;
        canapLocalStorage[itemIndex] = item;
        updateCart();
      } else {
        // Remettre la quantité d'origine si la nouvelle quantité est invalide
        alert("Quantié invalide");
        event.target.value = item.quantityKanap;
      }
    });
  });
}

// Partie Validation du formulaire avec Regex

// Validation du prénom
let firstNameInput = document.getElementById("firstName");

function validFirstName(input) {
  return /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/.test(
    input
  );
}

firstNameInput.addEventListener("change", () => {
  if (validFirstName(firstNameInput.value) === false) {
    firstNameErrorMsg.innerText = "SAISIE INVALIDE";
  } else {
    firstNameErrorMsg.innerText = "SAISIE VALIDE";
    firstNameErrorMsg.style.color = "#0a6a2a";
  }
});

//Validation du nom
let lastNameInput = document.getElementById("lastName");

function validLastName(input) {
  return /^[a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+([-'\s][a-zA-ZéèîïÉÈÎÏ][a-zéèêàçîï]+)?$/.test(
    input
  );
}
lastNameInput.addEventListener("change", () => {
  if (validLastName(lastNameInput.value) === false) {
    lastNameErrorMsg.innerText = "SAISIE INVALIDE";
  } else {
    lastNameErrorMsg.innerText = "SAISIE VALIDE";
    lastNameErrorMsg.style.color = "#0a6a2a";
  }
});

// Validation de l'adresse
let adressInput = document.getElementById("address");
function valideAdress(input) {
  return /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ\s\,\'\-]*$/.test(
    input
  );
}
adressInput.addEventListener("change", () => {
  if (valideAdress(adressInput.value) === false) {
    addressErrorMsg.innerText = "SAISIE INVALIDE";
  } else {
    addressErrorMsg.innerText = "SAISIE VALIDE";
    addressErrorMsg.style.color = "#0a6a2a";
  }
});

// Validation de la ville
let cityInput = document.getElementById("city");
function validCity(input) {
  return /^[a-zA-Z0-9àèìòùÀÈÌÒÙáéíóúýÁÉÍÓÚÝâêîôûÂÊÎÔÛãñõÃÑÕäëïöüÿÄËÏÖÜŸçÇ\s\,\'\-]*$/.test(
    input
  );
}
cityInput.addEventListener("change", () => {
  if (validCity(cityInput.value) === false) {
    cityErrorMsg.innerText = "SAISIE INVALIDE";
  } else {
    cityErrorMsg.innerText = "SAISIE VALIDE";
    cityErrorMsg.style.color = "#0a6a2a";
  }
});

//Validation du mail
let mailInput = document.getElementById("email");
function validMailInput(input) {
  return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(input);
}
mailInput.addEventListener("change", () => {
  if (validMailInput(mailInput.value) === false) {
    emailErrorMsg.innerText = "SAISIE INVALIDE";
  } else {
    emailErrorMsg.innerText = "SAISIE VALIDE";
    emailErrorMsg.style.color = "#0a6a2a";
  }
});

//Variables contenant les messages d'erreur
const firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
const lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
const addressErrorMsg = document.getElementById("addressErrorMsg");
const cityErrorMsg = document.getElementById("cityErrorMsg");
const emailErrorMsg = document.getElementById("emailErrorMsg");

// Partie envoie du formulaire
const postUrlApi = "http://localhost:3000/api/products/order";

const submitBtn = document.getElementById("order");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  //On vérifie que le formulaire soit bien rempli
  if (
    validFirstName(firstNameInput.value) == false ||
    validLastName(lastNameInput.value) == false ||
    valideAdress(adressInput.value) == false ||
    validCity(cityInput.value) == false ||
    validMailInput(mailInput.value) == false
  ) {
    alert("Vérifier votre formulaire");
  } else if (confirm("Confirmez-vous votre commande ? ") === true) {
    let arrayKanap = [];

    for (let productSelected of canapLocalStorage) {
      let idProductSelected = productSelected.idKanap;

      arrayKanap.push(idKanap = idProductSelected);
    }

    // On récupère les données du formulaire
    let dataOrder = {
      contact: {
        firstName: firstNameInput.value,
        lastName: lastNameInput.value,
        address: adressInput.value,
        city: cityInput.value,
        email: mailInput.value,
      },
      products: arrayKanap,
    };

    // Envoi du formulaire et redirection vers la page de confirmation
    const postForm = {
      method: "POST",
      body: JSON.stringify(dataOrder),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    fetch(postUrlApi, postForm)
      .then((response) => response.json())
      .then((datas) => {
        // Envoie des informations dans la page confirmation
        window.location.href = "confirmation.html?orderId=" + datas.orderId;
      })
      .catch((error) => {
        alert(error);
      });
  } else {
    return false;
  }
});
// Ces fonctions sont appelées au chargement de la page
window.addEventListener("load", deleteCanap, getTotalPrice, getTotalQuantity);
