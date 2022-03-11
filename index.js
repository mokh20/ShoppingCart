import { productsData } from "./products.js";

// DOM
const productDOM = document.querySelector(".products");
const shopCartBtn = document.querySelector(".shop-cart");
const boxShopCart = document.querySelector(".box-shop-cart");
const backDrop = document.querySelector(".back-drop");
const clearCart = document.querySelector(".clear-cart");
const cartTotalProduct = document.querySelector(".total-price");
const cartNumber = document.querySelector(".cart-number");
const boxShopItems = document.querySelector(".box-shop-items");

let cart = [];
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
    addProductToCart() {
        const productsBtns = document.querySelectorAll(".add-product");
        const buttons = [...productsBtns];
        buttons.forEach((Btn) => {
            const idBtn = Btn.dataset.id;
            const isInCart = cart.find((p) => {
                p.id === parseInt(idBtn);
            });
            if (isInCart) {
                Btn.innerText = "In Cart";
                Btn.disabled = true;
            }
            Btn.addEventListener("click", (productBtn) => {
                productBtn.target.innerText = "In Cart";
                Btn.disabled = true;
                // get product storage
                const addedProducts = {
                    ...Storage.getProductsStorage(idBtn),
                    quantity: 1,
                };
                // add to cart
                cart = [...cart, addedProducts];
                // save to storage
                Storage.saveToCart(cart);
                // update cart value
                this.totalPriceCart(cart);
                // show item in cart
                this.displayItemInCart(addedProducts);
            });
        });
    }
    totalPriceCart(cart) {
        let numberProduct = 0;
        const totalPrice = cart.reduce((acc, curr) => {
            numberProduct += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        cartTotalProduct.innerText = `Total Price : ${totalPrice.toFixed(2)} $`;
        cartNumber.innerText = numberProduct;
    }
    displayItemInCart(product) {
        const productItem = document.createElement("div");
        productItem.classList.add("box-shop-product");
        productItem.innerHTML = ` 
            <img src="${product.imgUrl}" alt="">
            <div class="product-description">
                <span>${product.title}</span>
                <div class="price "> ${product.price} $</div>
            </div>
            <div class="value">
                <i class="fa fa-angle-up"></i>
                <span>${product.quantity}</span>
                <i class="fa fa-angle-down"></i>
            </div>
            <i class="fa fa-trash-can"></i>
        `;
        boxShopItems.appendChild(productItem);
    }
    showItemCartLoaded() {
        cart = Storage.getCart() || [];
        cart.forEach((productITem) => {
            this.displayItemInCart(productITem);
            this.totalPriceCart(cart);
        });
    }
}
// Storage
class Storage {
    static saveStorage(product) {
        localStorage.setItem("products", JSON.stringify(product));
    }
    static getProductsStorage(id) {
        const productsList = JSON.parse(localStorage.getItem("products"));
        return productsList.find((product) => product.id === parseInt(id));
    }
    static saveToCart(cart) {
        localStorage.setItem("cart", JSON.stringify(cart));
    }
    static getCart() {
        return JSON.parse(localStorage.getItem("cart"));
    }
}

// EventListeners
document.addEventListener("DOMContentLoaded", () => {
    const products = new Products();
    const productsData = products.getProducts();
    const ui = new UI();
    ui.showItemCartLoaded();
    ui.displayProducts(productsData);
    ui.addProductToCart();
    Storage.saveStorage(productsData);
});

shopCartBtn.addEventListener("click", showShopCart);
backDrop.addEventListener("click", closeShopCart);
clearCart.addEventListener("click", closeShopCart);

// Functions
function showShopCart() {
    boxShopCart.style.display = "grid";
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