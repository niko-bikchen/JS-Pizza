/**
 * Created by chaika on 25.01.16.
 */

$(function(){
    //This code will execute when the page is ready
    var PizzaCart = require('./pizza/PizzaCart');
    var orderPage = require('./orderPage')

    require('./API').getPizzaList(function(error, data){
        require('./pizza/PizzaMenu').initialiseMenu(data);
    });

    PizzaCart.initialiseCart();
    orderPage.initialize();
});