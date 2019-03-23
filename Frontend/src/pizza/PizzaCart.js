/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');

//Перелік розмірів піци
var PizzaSize = {
    Big: "big_size",
    Small: "small_size"
};

var Sizes = {
    big_size: "Велика",
    small_size: "Мала"
};

//Змінна в якій зберігаються перелік піц в кошику
var Cart = [];

//HTML едемент куди будуть додаватися піци
var $cart = $("#cart");

function addToCart(pizza, size) {
    //Додавання однієї піци в кошик покупок
    size_name = Sizes[size];

    var present = false;
    var index = 0;

    for (; index < Cart.length; index++) {
        if ((Cart[index].pizza.title == pizza.title) && (Cart[index].size == size)) {
            present = true;
            break;
        }
    }

    var order_price = parseInt($cart.find("#order_summary #order_price").text()) + pizza[size].price;
    $cart.find("#order_summary #order_price").text(order_price);

    if (!present) {

        var items_number = parseInt($cart.find("#order_head #quantity").text()) + 1;
        $cart.find("#order_head #quantity").text(items_number);

        Cart.push({
            pizza: pizza,
            size: size,
            size_name: size_name,
            quantity: 1
        });
    } else {
        Cart[index].quantity += 1;
    }

    //Оновити вміст кошика на сторінці
    updateCart();
}

function removeFromCart(cart_item) {
    //Видалити піцу з кошика    
    var filtered = Cart.filter(function (item, index, arr) {
        return (item.pizza.title + item.size_name) != (cart_item.pizza.title + cart_item.size_name);
    });

    var items_number = parseInt($cart.find("#order_head #quantity").text()) - 1;
    $cart.find("#order_head #quantity").text(items_number);

    Cart = filtered;

    //Після видалення оновити відображення
    updateCart();
}

function initialiseCart() {
    //Фукнція віпрацьвуватиме при завантаженні сторінки

    var order_contents = JSON.parse(localStorage.getItem("order_contents"));

    if (order_contents === null) {
        localStorage.setItem("order_contents", JSON.stringify(Cart));
        localStorage.setItem("order_price", $cart.find("#order_summary #order_price").text());
        localStorage.setItem("order_size", $cart.find("#order_head #quantity").text());
    } else {
        Cart = order_contents;
        $cart.find("#order_summary #order_price").text(localStorage.getItem("order_price"));
        $cart.find("#order_head #quantity").text(localStorage.getItem("order_size"));
    }

    $cart.find("#clear").on("click", function () {
        Cart = [];
        $cart.find("#order_head #quantity").text(0);
        $cart.find("#order_summary #order_price").text(0);

        updateCart();
    });

    updateCart();
}

function getPizzaInCart() {
    //Повертає піци які зберігаються в кошику
    return Cart;
}

function updateCart() {
    //Функція викликається при зміні вмісту кошика
    //Тут можна наприклад показати оновлений кошик на екрані та зберегти вміт кошика в Local Storage

    //Очищаємо старі піци в кошику
    $cart.find("#order").html("");

    //Онволення однієї піци
    function showOnePizzaInCart(cart_item) {
        var html_code = Templates.PizzaCart_OneItem(cart_item);
        var $node = $(html_code);

        $node.find(".plus_btn").on("click", function () {
            //Збільшуємо кількість замовлених піц
            var order_price = parseInt($cart.find("#order_summary #order_price").text()) + cart_item.pizza[cart_item.size].price;
            $cart.find("#order_summary #order_price").text(order_price);

            cart_item.quantity += 1;

            //Оновлюємо відображення
            updateCart();
        });

        $node.find(".minus_btn").on("click", function () {
            var order_price = parseInt($cart.find("#order_summary #order_price").text()) - cart_item.pizza[cart_item.size].price;
            $cart.find("#order_summary #order_price").text(order_price);

            cart_item.quantity -= 1;

            if (cart_item.quantity <= 0) {
                removeFromCart(cart_item);
            }

            updateCart();
        });

        $node.find(".cross_btn").on("click", function () {
            removeFromCart(cart_item);

            var order_price = parseInt($cart.find("#order_summary #order_price").text()) - (cart_item.pizza[cart_item.size].price * cart_item.quantity);
            $cart.find("#order_summary #order_price").text(order_price);

            updateCart();
        });

        $cart.find("#order").append($node);
    }
    
    localStorage.setItem("order_contents", JSON.stringify(Cart));
    localStorage.setItem("order_price", $cart.find("#order_summary #order_price").text());
    localStorage.setItem("order_size", $cart.find("#order_head #quantity").text());

    Cart.forEach(showOnePizzaInCart);
}

exports.removeFromCart = removeFromCart;
exports.addToCart = addToCart;

exports.getPizzaInCart = getPizzaInCart;
exports.initialiseCart = initialiseCart;

exports.PizzaSize = PizzaSize;