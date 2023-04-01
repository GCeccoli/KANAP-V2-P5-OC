//Collecte des données de l'api
function collecteProducts(){
    return (fetch("http://localhost:3000/api/products")
    .then (details => details.json())
    .then ((promiseDetails) => {
        detailsProduct = promiseDetails;
        })
    );
};


// Insertion des éléments dans le DOM
async function detailsProduct(){
    await collecteProducts();
    const productsData = detailsProduct;
    document.getElementById("items").innerHTML = productsData.map((products) => `<a href="./product.html?id=${products._id}"> <article> <img src="${products.imageUrl}" alt="${products.altTxt}"> <h3 class="productName">${products.name}</h3> <p class="productDescription">${products.description}></p> </article> </a>`).join("")
};
detailsProduct();