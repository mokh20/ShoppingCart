import { productsData } from "./products.js";

// DOM
const productDOM = document.querySelector(".products");
const shopCartBtn = document.querySelector(".shop-cart");
const boxShopCart = document.querySelector(".box-shop-cart");
const backDrop = document.querySelector(".back-drop");
const clearCart = document.querySelector(".clear-cart");

// Get Products
class Products {
    getProducts() {
        return productsData;
    }
}

// Display Products
class UI {
    displayProducts(products) {
        let productBox = "";
        products.forEach((item) => {
            productBox += `
            <div class="product-box">
                <img src="${item.imgUrl}" alt="">
                <div class="description">
                    <div class="price">Price :${item.price} $</div>
                    <div class="product-name">${item.title}</div>
                </div>
                <button class="button-shop add-product"data-id=${item.id}>add to cart</button>
            </div>
            `;
            productDOM.innerHTML = productBox;
        });
    }
}
// Storage
class Storage {
    static saveStorage(product) {
        localStorage.setItem("products", JSON.stringify(product));
    }
}

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.displayProducts(productsData);
    Storage.saveStorage(productsData);
});

shopCartBtn.addEventListener("click", showShopCart);
backDrop.addEventListener("click", closeShopCart);
clearCart.addEventListener("click", closeShopCart);

// Functions
function showShopCart() {
    boxShopCart.style.display = "flex";
    boxShopCart.style.visibility = "visible";
    backDrop.style.display = "block";
    backDrop.style.visibility = "visible";
}

function closeShopCart() {
    boxShopCart.style.display = "none";
    boxShopCart.style.visibility = "hidden";
    backDrop.style.display = "none";
    backDrop.style.visibility = "hidden";
}