import { productsData } from "./products.js";

// DOM
const productDOM = document.querySelector(".products");
const shopCartBtn = document.querySelector(".shop-cart");
const cartNumber = document.querySelector(".cart-number");
const boxShopCart = document.querySelector(".box-shop-cart");
const backDrop = document.querySelector(".back-drop");
const clearCartBtn = document.querySelector(".clear-cart");
const confirmBtn = document.querySelector(".confirm-cart");
const cartTotalProduct = document.querySelector(".total-price");
const boxShopItems = document.querySelector(".box-shop-items");

let cart = [];
let buttons = [];
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
        const productsBtns = [...document.querySelectorAll(".add-product")];
        buttons = productsBtns;
        // get btn data-id
        buttons.forEach((Btn) => {
            const idBtn = Btn.dataset.id;
            // find btn id in cart
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
        // get totalPrice products
        const totalPrice = cart.reduce((acc, curr) => {
            numberProduct += curr.quantity;
            return acc + curr.quantity * curr.price;
        }, 0);
        // display totalPrice in cart
        cartTotalProduct.innerText = `Total Price : ${totalPrice.toFixed(2)} $`;
        cartNumber.innerText = numberProduct;
    }

    // create product for cart
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
                <i class="fa fa-angle-up" data-id='${product.id}'></i>
                <span>${product.quantity}</span>
                <i class="fa fa-angle-down" data-id='${product.id}'></i>
            </div>
            <i class="fa fa-trash-can" data-id='${product.id}'></i>
        `;
        boxShopItems.appendChild(productItem);
    }

    // show cart products when page loaded
    showItemCartLoaded() {
        // get cart from local
        cart = Storage.getCart() || [];
        cart.forEach((productITem) => {
            // show cart products
            this.displayItemInCart(productITem);
            // show cart totalPrice
            this.totalPriceCart(cart);
        });
    }

    // disable btn cart product |  when page loaded
    inCart() {
        // get cart
        const inCartItems = Storage.getCart() || [];
        inCartItems.forEach((product) => {
            const isInCart = buttons.find((btn) => {
                // find id product is in cart
                return parseInt(btn.dataset.id) === parseInt(product.id);
            });
            if (isInCart) {
                isInCart.innerText = "In Cart";
                isInCart.disabled = true;
            }
        });
    }

    // enable btn cart
    activeBtnCart(id) {
        // find id product
        const button = buttons.find(
            (btn) => parseInt(btn.dataset.id) === parseInt(id)
        );
        button.innerText = "add to cart";
        button.disabled = false;
    }
    clearCart() {
        cart.forEach((item) => this.removeItem(item.id));
        // clear products are in cart | one by one
        while (boxShopItems.children.length) {
            boxShopItems.removeChild(boxShopItems.children[0]);
        }
    }
    removeItem(id) {
        // selete products not in cart
        cart = cart.filter((item) => item.id !== id);
        // show price
        this.totalPriceCart(cart);
        // update cart
        Storage.saveToCart(cart);
        // enable btn products
        this.activeBtnCart(id);
    }

    //cart buttons commands
    cartLogic() {
        clearCartBtn.addEventListener("click", () => {
            this.clearCart();
            closeShopCart();
        });
        boxShopItems.addEventListener("click", (event) => {
            if (event.target.classList.contains("fa-angle-up")) {
                const addQuantity = event.target;
                //1. get cart
                const addedItem = cart.find((cItem) => {
                    return cItem.id === parseInt(addQuantity.dataset.id);
                });
                addedItem.quantity++;
                //2. update cart value
                this.totalPriceCart(cart);
                //3. save cart
                Storage.saveToCart(cart);
                //4. update ui number cart
                addQuantity.nextElementSibling.innerText = addedItem.quantity;
            } else if (event.target.classList.contains("fa-trash-can")) {
                const removeItem = event.target;
                // get product id
                const removedItem = cart.find(
                    (c) => c.id === parseInt(removeItem.dataset.id)
                );
                this.removeItem(removedItem.id);
                Storage.saveToCart(cart);
                boxShopItems.removeChild(removeItem.parentElement);
            } else if (event.target.classList.contains("fa-angle-down")) {
                const decrementQuantity = event.target;
                //1. get cart
                const reducedItem = cart.find((cItem) => {
                    return cItem.id === parseInt(decrementQuantity.dataset.id);
                });
                if (reducedItem.quantity === 1) {
                    this.removeItem(reducedItem.id);
                    boxShopItems.removeChild(
                        decrementQuantity.parentElement.parentElement
                    );
                    return;
                }
                reducedItem.quantity--;
                //2. update cart value
                this.totalPriceCart(cart);
                //3. save cart
                Storage.saveToCart(cart);
                //4. update ui number cart
                decrementQuantity.previousElementSibling.innerText =
                    reducedItem.quantity;
            }
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
    ui.inCart();
    ui.cartLogic();
    Storage.saveStorage(productsData);
});

shopCartBtn.addEventListener("click", showShopCart);
backDrop.addEventListener("click", closeShopCart);
confirmBtn.addEventListener("click", closeShopCart);

// Functions
function showShopCart() {
    boxShopCart.style.display = "grid";
    boxShopCart.style.visibility = "visible";
    backDrop.style.display = "block";
    boxShopCart.style.top = "5%";
}

function closeShopCart() {
    boxShopCart.style.display = "none";
    boxShopCart.style.visibility = "hidden";
    boxShopCart.style.top = "-100%";
    backDrop.style.display = "none";
}
backDrop.style.display = "none";