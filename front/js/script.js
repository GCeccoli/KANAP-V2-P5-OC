// Variable pour stocker notre api
const urlApi = "http://localhost:3000/api/products/";

// On récupère l'élément html avec l'ID items
const displayProducts = document.querySelector("#items");

// On appel notre API pour récupérer de données
fetch(urlApi)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    for (products of data) {
      // On intègre les éléments de l'api dans le DOM
      const displayProductsHTML = `<a href="./product.html?id=${products._id}">
        <article>
          <img src=${products.imageUrl} alt=${products.altTxt}>
          <h3 class="productName">${products.name}</h3>
          <p class="productDescription">${products.description}</p>
        </article>
      </a>`;
      displayProducts.innerHTML += displayProductsHTML;
    }
  })
  // Un message d'erreur s'affiche si le serveur est injoignable
  .catch((err) => {
    let errorMessagePosition = document.getElementById("items");
    let errorMessage = `<h2> La requête serveur a échouée ${err} </h2>`;
    errorMessagePosition.style.color = "red";
    errorMessagePosition.style.backgroundColor = "white";
    errorMessagePosition.innerHTML = errorMessage;
  });
