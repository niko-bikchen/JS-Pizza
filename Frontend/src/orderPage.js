var $form = $(".form-horizontal");
var $inputName = $form.find("#inputName");
var $inputPhone = $form.find("#inputPhone");
var $inputAddress = $form.find("#inputAdress");
var $btn = $form.parent().parent().find("#proceed_btn");
var $delivery_details = $form.parent().parent().find("#delivery_details");

var home_marker = null;
var directionsDisplay = null;
var directionService = null;

function calculateRoute(A_latlng, B_latlng, callback) {
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];
            directionsDisplay.setDirections(response);
            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Can't find the route"));
        }
    });
}

function geocodeLatLang(latlng, callback) {
    var geocoder = new google.maps.Geocoder();

    geocoder.geocode({ 'location': latlng }, function (result, status) {
        if (status === google.maps.GeocoderStatus.OK && result[1]) {
            var address = result[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find address"));
        }
    });
}

function init() {
    if (document.getElementById("googleMap") !== null) {
        var mapProp = {
            center: new google.maps.LatLng(50.464379, 30.519131),
            zoom: 12
        }

        var html_element = document.getElementById("googleMap");

        var map = new google.maps.Map(html_element, mapProp);

        directionService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        directionsDisplay.setOptions({ suppressMarkers: true });

        var marker_shop = new google.maps.Marker({
            position: mapProp["center"],
            map,
            icon: "assets/images/map-icon.png"
        });

        google.maps.event.addListener(map, 'click', function (me) {
            var coord = me.latLng;
            geocodeLatLang(coord, function (err, address) {
                if (!err) {
                    $inputAddress.val(address);

                    if (home_marker !== null) {
                        home_marker.setMap(null);
                    }

                    home_marker = new google.maps.Marker({
                        position: coord,
                        map: map,
                        icon: "assets/images/home-icon.png"
                    })

                    calculateRoute(new google.maps.LatLng(50.464379, 30.519131), coord, function (err, data) {
                        $delivery_details.find(".delivery_details_time").find(".value").text(data["duration"]["text"]);
                        $delivery_details.find(".delivery_details_address").find(".value").text(address);
                        $inputAddress.parent().parent().addClass("has-success");
                        $inputAddress.parent().parent().removeClass("has-error");
                        $inputAddress.parent().parent().find(".address-help-block").attr("style", "display: none;");
                    });
                } else {
                    $inputAddress.val("Не вдалося знайти вказану адресу");
                }
            });
        });
    }
}

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

    $inputAddress.on("keyup", function () {
        if ($inputAddress.val().length > 0) {
            $inputAddress.parent().parent().removeClass("has-error");
            $inputAddress.parent().parent().addClass("has-success");
            $inputAddress.parent().parent().find(".address-help-block").attr("style", "display: none;");
        } else {
            $inputAddress.parent().parent().addClass("has-error");
            $inputAddress.parent().parent().find(".address-help-block").removeAttr("style");
        }
    });

    $btn.on("click", function () {
        var name = null;
        var phone = null;
        var address = "";
        if ($inputName.parent().parent().hasClass("has-success")
            && $inputPhone.parent().parent().hasClass("has-success")
            && $inputAddress.parent().parent().hasClass("has-success")) {
            name = $inputName.val();
            phone = $inputPhone.val();
            address = $inputAddress.val();

            require('./API').createOrder({
                name,
                phone,
                address,
                pizzas: localStorage.getItem("order_contents"),
                price: localStorage.getItem("order_price")
            }, function (error, data) {
                if (data["success"]) {
                    console.log("Data received successfully");
                }
            });
        } else {
            if (!$inputName.parent().parent().hasClass("has-success")) {
                $inputName.parent().parent().addClass("has-error");
                $inputName.parent().parent().find(".name-help-block").removeAttr("style");
            } else if (!$inputPhone.parent().parent().hasClass("has-success")) {
                $inputPhone.parent().parent().addClass("has-error");
                $inputPhone.parent().parent().find(".phone-help-block").removeAttr("style");
            } else if (!$inputAddress.parent().parent().hasClass("has-success")) {
                $inputAddress.parent().parent().addClass("has-error");
                $inputAddress.parent().parent().find(".address-help-block").removeAttr("style");
            }
        }
    });

    google.maps.event.addDomListener(window, 'load', init);
}

exports.initialize = initialize;