//On récupère l'id de l'url actuelle en fonction du produit sélectionné
const queryString_url_id = window.location.search;
const url = new URLSearchParams(queryString_url_id);
const idProduct = url.get("id");
let product = "";

// Fonction qui récupère les produits à partir de l'API
function getProduct() {
  fetch("http://localhost:3000/api/products/" + idProduct)
    .then((response) => {
      return response.json();
    })
    .then(async function (apiResult) {
      product = await apiResult;
      if (product) {
        getPost(product);
      }
    })
    .catch((err) => alert(err));
}

getProduct();

function getPost(product) {
  //Intégration de l'image + texte alternatif
  let productImg = document.createElement("img");
  document.querySelector(".item__img").appendChild(productImg);
  productImg.src = product.imageUrl;
  productImg.alt = product.altTxt;

  // Integration du titre du produit
  let productName = document.getElementById("title");
  productName.innerHTML = product.name;

  //Integration du prix
  let productPrice = document.getElementById("price");
  productPrice.innerHTML = product.price;

  //Integration de la description
  let productDescription = document.getElementById("description");
  productDescription.innerHTML = product.description;

  // Insertion des options de couleurs
  for (let colors of product.colors) {
    let productColors = document.createElement("option");
    document.getElementById("colors").appendChild(productColors);
    productColors.value = colors;
    productColors.innerHTML = colors;
  }
}

let choiceQuantity = document.querySelector("#quantity");
let choiceColor = document.querySelector("#colors");
let sendToCart = document.querySelector("#addToCart");

sendToCart.addEventListener("click", () => {
  // Chercher le panier dans le LocalStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart"));
  }
  let cart = getCart() || [];

  // On enregistre le panier dans le localStorage
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // Fonction d'ajout au panier
  function addToCart() {
    let addedItem = {
      idKanap: idProduct,
      colorKanap: choiceColor.value,
      quantityKanap: Number(choiceQuantity.value),
    };

    // On recherche si le produit est déjà dans le panier
    let foundProduct = cart.find(
      (p) => p.idKanap == idProduct && p.colorKanap == choiceColor.value
    );

    // On vérifie que la quantité est valide,
    // Si oui soit on créé un nouveau tableau, soit on incrémente la quantité
    if (
      isNaN.quantityKanap == choiceQuantity.value ||
      choiceQuantity.value < 1 ||
      choiceQuantity.value > 100
    ) {
      alert("Quantité incorrecte");
    } else if (choiceColor.value == 0) {
      alert("Choisissez une couleur");
    } else if (foundProduct !== undefined) {
      foundProduct.quantityKanap =
        parseInt(foundProduct.quantityKanap) + parseInt(choiceQuantity.value);
      alert("Produit ajouté au panier");
    } else {
      cart.push(addedItem);
      alert("Produit ajouté au panier");
    }
    saveCart(cart);
  }
  addToCart();
});
