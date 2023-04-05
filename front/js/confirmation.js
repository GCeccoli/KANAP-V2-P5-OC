// On récupère les informations stockées dans le local storage
localStorage.getItem("cart");

// Récupération de l'id de la commande
const submitId = new URL (window.location.href);
const id = submitId.searchParams.get("orderId");

//Intégration dans le DOM de l'id de commande
document.getElementById("orderId").innerHTML = id;

  