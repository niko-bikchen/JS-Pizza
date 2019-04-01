/**
 * Created by chaika on 02.02.16.
 */
var Templates = require('../Templates');
var PizzaCart = require('./PizzaCart');
var Pizza_List = null;

//HTML едемент куди будуть додаватися піци
var $pizza_list = $("#pizza_list .row .col-md-12 .row");



function showPizzaList(list) {
    //Очищаємо старі піци в кошику
    $pizza_list.html("");

    //Онволення однієї піци
    function showOnePizza(pizza) {
        var html_code = Templates.PizzaMenu_OneItem({ pizza: pizza });

        var $node = $(html_code);

        $node.find(".buy_big").on("click", function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Big);
        });
        $node.find(".buy_small").on("click", function () {
            PizzaCart.addToCart(pizza, PizzaCart.PizzaSize.Small);
        });

        $pizza_list.append($node);
    }

    $("#pizza_list_title_pizza_quantity").text(list.length);

    list.forEach(showOnePizza);
}

function initialiseMenu(pizza_list) {
    Pizza_List = pizza_list;

    //Показуємо усі піци
    showPizzaList(Pizza_List);

    $("#filters #all").on("click", function () {
        $("#filters .chosen_filter").removeAttr("class");
        $("#filters #all").attr("class", "chosen_filter");

        showPizzaList(Pizza_List);
    });

    $("#filters #meat").on("click", function () {
        var filtered = Pizza_List.filter(function(pizza, index, arr){
            return pizza.type === "М’ясна піца";
        });

        $("#filters .chosen_filter").removeAttr("class");
        $("#filters #meat").attr("class", "chosen_filter");

        showPizzaList(filtered);
    });

    $("#filters #seafood").on("click", function () {
        var filtered = Pizza_List.filter(function(pizza, index, arr){
            return pizza.type === "Морська піца";
        });

        $("#filters .chosen_filter").removeAttr("class");
        $("#filters #seafood").attr("class", "chosen_filter");

        showPizzaList(filtered);
    });

    $("#filters #mushrooms").on("click", function () {
        var filtered = Pizza_List.filter(function(pizza, index, arr){
            return pizza.type == "З грибами";
        });

        $("#filters .chosen_filter").removeAttr("class");
        $("#filters #mushrooms").attr("class", "chosen_filter");

        showPizzaList(filtered);
    });

    $("#filters #pineapples").on("click", function () {
        var filtered = Pizza_List.filter(function(pizza, index, arr){
            return pizza.type == "З ананасами";
        });

        $("#filters .chosen_filter").removeAttr("class");
        $("#filters #pineapples").attr("class", "chosen_filter");

        showPizzaList(filtered);
    });
}

exports.initialiseMenu = initialiseMenu;