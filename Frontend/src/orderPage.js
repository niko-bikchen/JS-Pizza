var $cart = $("#order_cart");
var $form = $(".form-horizontal");
var $inputName = $form.find("#inputName");
var $inputPhone = $form.find("#inputPhone");
var $inputAddress = $form.find("#inputAddress");
var $btn = $form.parent().parent().find("#proceed_btn");

function initialize() {

    $inputName.on("keyup", function () {
        if (!(/^[А-яA-zІ-і]+$/.test($inputName.val()))) {
            $inputName.parent().parent().addClass("has-error");
            $inputName.parent().parent().find(".name-help-block").removeAttr("style");
        } else {
            $inputName.parent().parent().removeClass("has-error");
            $inputName.parent().parent().addClass("has-success");
            $inputName.parent().parent().find(".name-help-block").attr("style", "display: none;");
        }
    });

    $inputPhone.on("keyup", function () {
        if ($inputPhone.val().startsWith("0") && $inputPhone.val().length == 10) {
            $inputPhone.parent().parent().removeClass("has-error");
            $inputPhone.parent().parent().addClass("has-success");
            $inputPhone.parent().parent().find(".phone-help-block").attr("style", "display: none;");
        }
        else if ($inputPhone.val().startsWith("+380") && $inputPhone.val().length == 13) {
            $inputPhone.parent().parent().removeClass("has-error");
            $inputPhone.parent().parent().addClass("has-success");
            $inputPhone.parent().parent().find(".phone-help-block").attr("style", "display: none;");
        }
        else {
            $inputPhone.parent().parent().addClass("has-error");
            $inputPhone.parent().parent().find(".phone-help-block").removeAttr("style");
        }
    });

    $btn.on("click", function () {
        var name = null;
        var phone = null;
        var address = "";
        if ($inputName.parent().parent().hasClass("has-success") && $inputPhone.parent().parent().hasClass("has-success")) {
            name = $inputName.val();
            phone = $inputPhone.val();
            address = $inputAddress.val();

            require('./API').createOrder({
                name: name,
                phone: phone,
                address: address,
                pizzas: localStorage.getItem("order_contents"),
                price: localStorage.getItem("order_price")
            }, function (error, data) {
                if (data["success"]) {
                    console.log("Data received successfully");
                }
            });
        }
    });
}

exports.initialize = initialize;