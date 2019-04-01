var $cart = $("#cart");
var $form = $(".form-horizontal");
var $inputName = $form.find("#inputName");
var $inputPhone = $form.find("#inputPhone");
var $inputAddress = $form.find("#inputAddress");

$(function () {
    $cart.find(".plus_btn").remove();
    $cart.find(".minus_btn").remove();
    $cart.find(".cross_btn").remove();

    $inputName.on("keyup", function () {
        if (!(/^[а-яА-Я]+$/.test($inputName.val()))) {
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
});