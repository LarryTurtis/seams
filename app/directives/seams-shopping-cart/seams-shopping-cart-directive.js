'use strict';

(function(angular) {

    // App Module: the name AngularStore matches the ng-app attribute in the main <html> tag
    // the route provides parses the URL and injects the appropriate partial page
    var storeApp = angular.module('AngularStore', []);

    // the storeController contains two objects:
    // - store: contains the product list
    // - cart: the shopping cart object
    var storeController = function($scope, DataService) {

        $scope.currentView = "partials/store.html";

        $scope.changeCurrentView = function(view, id) {

            switch (view) {
                case 'cart':
                    $scope.currentView = "partials/shoppingCart.html";
                    break;
                case 'store':
                    $scope.currentView = "partials/store.html";
                    break;
                case 'product':
                    $scope.currentView = "partials/product.html"
                    break;
                default:
                    $scope.currentView = "partials/store.html"
            }

            if (id) {
                $scope.product = $scope.store.getProduct(id);
            };

        };

        $scope.$watch("productData", function() {

            var productData = $scope.productData;

            if (productData && productData.length) {

                // get store and cart from service
                $scope.store = DataService.store(productData);
                $scope.cart = DataService.cart;
                
            }
        }, true);
    };

    storeApp.directive("shoppingCart", function() {
        return {
            restrict: "E",
            templateUrl: "partials/angularjs-cart.html",
            scope: {
                productData: "="
            },
            controller: storeController
        }
    });

    // create a data service that provides a store and a shopping cart that
    // will be shared by all views (instead of creating fresh ones for each view).
    storeApp.factory("DataService", function() {

        // create store
        var myStore = function(products) {
            return new store(products);
        }

        // create shopping cart
        var myCart = new shoppingCart("AngularStore");

        // enable PayPal checkout
        // note: the second parameter identifies the merchant; in order to use the 
        // shopping cart with PayPal, you have to create a merchant account with 
        // PayPal. You can do that here:
        // https://www.paypal.com/webapps/mpp/merchant
        myCart.addCheckoutParameters("PayPal", "paypaluser@youremail.com");

        // enable Google Wallet checkout
        // note: the second parameter identifies the merchant; in order to use the 
        // shopping cart with Google Wallet, you have to create a merchant account with 
        // Google. You can do that here:
        // https://developers.google.com/commerce/wallet/digital/training/getting-started/merchant-setup
        // myCart.addCheckoutParameters("Google", "xxxxxxx",
        //     {
        //         ship_method_name_1: "UPS Next Day Air",
        //         ship_method_price_1: "20.00",
        //         ship_method_currency_1: "USD",
        //         ship_method_name_2: "UPS Ground",
        //         ship_method_price_2: "15.00",
        //         ship_method_currency_2: "USD"
        //     }
        // );

        // enable Stripe checkout
        // note: the second parameter identifies your publishable key; in order to use the 
        // shopping cart with Stripe, you have to create a merchant account with 
        // Stripe. You can do that here:
        // https://manage.stripe.com/register
        // myCart.addCheckoutParameters("Stripe", "pk_test_xxxx",
        //     {
        //         chargeurl: "https://localhost:1234/processStripe.aspx"
        //     }
        // );

        // return data object with store and cart
        return {
            store: myStore,
            cart: myCart
        };
    });

    //----------------------------------------------------------------
    // product class
    var product = function(sku, name, description, price, image) {
        this.sku = sku; // product code (SKU = stock keeping unit)
        this.name = name;
        this.description = description;
        this.image = image;
        this.price = price;
    }

    //----------------------------------------------------------------
    // shopping cart
    //
    function shoppingCart(cartName) {
        this.cartName = cartName;
        this.clearCart = false;
        this.checkoutParameters = {};
        this.items = [];

        // load items from local storage when initializing
        this.loadItems();

        // save items to local storage when unloading
        var self = this;
        $(window).unload(function() {
            if (self.clearCart) {
                self.clearItems();
            }
            self.saveItems();
            self.clearCart = false;
        });
    }

    // load items from local storage
    shoppingCart.prototype.loadItems = function() {
        var items = localStorage != null ? localStorage[this.cartName + "_items"] : null;
        if (items != null && JSON != null) {
            try {
                var items = JSON.parse(items);
                for (var i = 0; i < items.length; i++) {
                    var item = items[i];
                    if (item.sku != null && item.name != null && item.price != null && item.quantity != null) {
                        item = new cartItem(item.sku, item.name, item.price, item.quantity);
                        this.items.push(item);
                    }
                }
            } catch (err) {
                // ignore errors while loading...
            }
        }
    }

    // save items to local storage
    shoppingCart.prototype.saveItems = function() {
        if (localStorage != null && JSON != null) {
            localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
        }
    }

    // adds an item to the cart
    shoppingCart.prototype.addItem = function(sku, name, price, quantity) {
        quantity = this.toNumber(quantity);
        if (quantity != 0) {

            // update quantity for existing item
            var found = false;
            for (var i = 0; i < this.items.length && !found; i++) {
                var item = this.items[i];
                if (item.sku == sku) {
                    found = true;
                    item.quantity = this.toNumber(item.quantity + quantity);
                    if (item.quantity <= 0) {
                        this.items.splice(i, 1);
                    }
                }
            }

            // new item, add now
            if (!found) {
                var item = new cartItem(sku, name, price, quantity);
                this.items.push(item);
            }

            // save changes
            this.saveItems();
        }
    }

    // get the total price for all items currently in the cart
    shoppingCart.prototype.getTotalPrice = function(sku) {
        var total = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (sku == null || item.sku == sku) {
                total += this.toNumber(item.quantity * item.price);
            }
        }
        return total;
    }

    // get the total price for all items currently in the cart
    shoppingCart.prototype.getTotalCount = function(sku) {
        var count = 0;
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if (sku == null || item.sku == sku) {
                count += this.toNumber(item.quantity);
            }
        }
        return count;
    }

    // clear the cart
    shoppingCart.prototype.clearItems = function() {
        this.items = [];
        this.saveItems();
    }

    // define checkout parameters
    shoppingCart.prototype.addCheckoutParameters = function(serviceName, merchantID, options) {

        // check parameters
        if (serviceName != "PayPal" && serviceName != "Google" && serviceName != "Stripe") {
            throw "serviceName must be 'PayPal' or 'Google' or 'Stripe'.";
        }
        if (merchantID == null) {
            throw "A merchantID is required in order to checkout.";
        }

        // save parameters
        this.checkoutParameters[serviceName] = new checkoutParameters(serviceName, merchantID, options);
    }

    // check out
    shoppingCart.prototype.checkout = function(serviceName, clearCart) {

        // select serviceName if we have to
        if (serviceName == null) {
            var p = this.checkoutParameters[Object.keys(this.checkoutParameters)[0]];
            serviceName = p.serviceName;
        }

        // sanity
        if (serviceName == null) {
            throw "Use the 'addCheckoutParameters' method to define at least one checkout service.";
        }

        // go to work
        var parms = this.checkoutParameters[serviceName];
        if (parms == null) {
            throw "Cannot get checkout parameters for '" + serviceName + "'.";
        }
        switch (parms.serviceName) {
            case "PayPal":
                this.checkoutPayPal(parms, clearCart);
                break;
            case "Google":
                this.checkoutGoogle(parms, clearCart);
                break;
            case "Stripe":
                this.checkoutStripe(parms, clearCart);
                break;
            default:
                throw "Unknown checkout service: " + parms.serviceName;
        }
    }

    // check out using PayPal
    // for details see:
    // www.paypal.com/cgi-bin/webscr?cmd=p/pdn/howto_checkout-outside
    shoppingCart.prototype.checkoutPayPal = function(parms, clearCart) {

        // global data
        var data = {
            cmd: "_cart",
            business: parms.merchantID,
            upload: "1",
            rm: "2",
            charset: "utf-8"
        };

        // item data
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var ctr = i + 1;
            data["item_number_" + ctr] = item.sku;
            data["item_name_" + ctr] = item.name;
            data["quantity_" + ctr] = item.quantity;
            data["amount_" + ctr] = item.price.toFixed(2);
        }

        // build form
        var form = $('<form/></form>');
        form.attr("action", "https://www.paypal.com/cgi-bin/webscr");
        form.attr("method", "POST");
        form.attr("style", "display:none;");
        this.addFormFields(form, data);
        this.addFormFields(form, parms.options);
        $("body").append(form);

        // submit form
        this.clearCart = clearCart == null || clearCart;
        form.submit();
        form.remove();
    }

    // check out using Google Wallet
    // for details see:
    // developers.google.com/checkout/developer/Google_Checkout_Custom_Cart_How_To_HTML
    // developers.google.com/checkout/developer/interactive_demo
    shoppingCart.prototype.checkoutGoogle = function(parms, clearCart) {

        // global data
        var data = {};

        // item data
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var ctr = i + 1;
            data["item_name_" + ctr] = item.sku;
            data["item_description_" + ctr] = item.name;
            data["item_price_" + ctr] = item.price.toFixed(2);
            data["item_quantity_" + ctr] = item.quantity;
            data["item_merchant_id_" + ctr] = parms.merchantID;
        }

        // build form
        var form = $('<form/></form>');
        // NOTE: in production projects, use the checkout.google url below;
        // for debugging/testing, use the sandbox.google url instead.
        //form.attr("action", "https://checkout.google.com/api/checkout/v2/merchantCheckoutForm/Merchant/" + parms.merchantID);
        form.attr("action", "https://sandbox.google.com/checkout/api/checkout/v2/checkoutForm/Merchant/" + parms.merchantID);
        form.attr("method", "POST");
        form.attr("style", "display:none;");
        this.addFormFields(form, data);
        this.addFormFields(form, parms.options);
        $("body").append(form);

        // submit form
        this.clearCart = clearCart == null || clearCart;
        form.submit();
        form.remove();
    }

    // check out using Stripe
    // for details see:
    // https://stripe.com/docs/checkout
    shoppingCart.prototype.checkoutStripe = function(parms, clearCart) {

        // global data
        var data = {};

        // item data
        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var ctr = i + 1;
            data["item_name_" + ctr] = item.sku;
            data["item_description_" + ctr] = item.name;
            data["item_price_" + ctr] = item.price.toFixed(2);
            data["item_quantity_" + ctr] = item.quantity;
        }

        // build form
        var form = $('.form-stripe');
        form.empty();
        // NOTE: in production projects, you have to handle the post with a few simple calls to the Stripe API.
        // See https://stripe.com/docs/checkout
        // You'll get a POST to the address below w/ a stripeToken.
        // First, you have to initialize the Stripe API w/ your public/private keys.
        // You then call Customer.create() w/ the stripeToken and your email address.
        // Then you call Charge.create() w/ the customer ID from the previous call and your charge amount.
        form.attr("action", parms.options['chargeurl']);
        form.attr("method", "POST");
        form.attr("style", "display:none;");
        this.addFormFields(form, data);
        this.addFormFields(form, parms.options);
        $("body").append(form);

        // ajaxify form
        form.ajaxForm({
            success: function() {
                $.unblockUI();
                alert('Thanks for your order!');
            },
            error: function(result) {
                $.unblockUI();
                alert('Error submitting order: ' + result.statusText);
            }
        });

        var token = function(res) {
            var $input = $('<input type=hidden name=stripeToken />').val(res.id);

            // show processing message and block UI until form is submitted and returns
            $.blockUI({
                message: 'Processing order...'
            });

            // submit form
            form.append($input).submit();
            this.clearCart = clearCart == null || clearCart;
            form.submit();
        };

        StripeCheckout.open({
            key: parms.merchantID,
            address: false,
            amount: this.getTotalPrice() * 100,
            /** expects an integer **/
            currency: 'usd',
            name: 'Purchase',
            description: 'Description',
            panelLabel: 'Checkout',
            token: token
        });
    }

    // utility methods
    shoppingCart.prototype.addFormFields = function(form, data) {
        if (data != null) {
            $.each(data, function(name, value) {
                if (value != null) {
                    var input = $("<input></input>").attr("type", "hidden").attr("name", name).val(value);
                    form.append(input);
                }
            });
        }
    }
    shoppingCart.prototype.toNumber = function(value) {
        value = value * 1;
        return isNaN(value) ? 0 : value;
    }

    //----------------------------------------------------------------
    // checkout parameters (one per supported payment service)
    //
    function checkoutParameters(serviceName, merchantID, options) {
        this.serviceName = serviceName;
        this.merchantID = merchantID;
        this.options = options;
    }

    //----------------------------------------------------------------
    // items in the cart
    //
    function cartItem(sku, name, price, quantity) {
        this.sku = sku;
        this.name = name;
        this.price = price * 1;
        this.quantity = quantity * 1;
    }

    //----------------------------------------------------------------
    // store (contains the products)
    //
    // NOTE: nutritional info from http://www.cspinet.org/images/fruitcha.jpg
    // score legend:
    // 0: below 5% of daily value (DV)
    // 1: 5-10% DV
    // 2: 10-20% DV
    // 3: 20-40% DV
    // 4: above 40% DV
    //
    function store(productData) {

        this.products = [];

        for (var i = 0; i < productData.length; i++) {

            this.products.push(
                new product(
                    productData[i].id,
                    productData[i].name,
                    productData[i].description,
                    productData[i].price,
                    productData[i].image
                ));

        }
    }

    store.prototype.getProduct = function(sku) {
        for (var i = 0; i < this.products.length; i++) {
            if (this.products[i].sku == sku)
                return this.products[i];
        }
        return null;
    };

})(angular);
angular.module('AngularStore').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('partials/angularjs-cart.html',
    "<style>\n" +
    ".table td.tdRight {\n" +
    "    text-align: right;\n" +
    "}\n" +
    ".table td.tdCenter {\n" +
    "    text-align: center;\n" +
    "}\n" +
    ".table-nonfluid {\n" +
    "    width: auto;\n" +
    "}\n" +
    "</style>\n" +
    "\n" +
    "<div class=\"span10 offset1\">\n" +
    "    <div ng-include=\"currentView\"></div>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/product.html',
    "<p class=\"text-info\">\n" +
    "    <img ng-src=\"{{product.image}}\" alt=\"{{product.name}}\"/>\n" +
    "    {{product.name}}: {{product.description}}<br />\n" +
    "</p>\n" +
    "\n" +
    "<div class=\"container-fluid\">\n" +
    "    <div class=\"row-fluid\">\n" +
    "        <div class=\"span8\">\n" +
    "\n" +
    "            <!-- product info -->\n" +
    "            <table class=\"table table-bordered\">\n" +
    "\n" +
    "                <tr class=\"well\">\n" +
    "                    <td class=\"tdRight\" colspan=\"3\" >\n" +
    "                        <a href=\"\" ng-click=\"changeCurrentView('cart')\" title=\"go to shopping cart\" ng-disabled=\"cart.getTotalCount() < 1\">\n" +
    "                            <i class=\"icon-shopping-cart\" />\n" +
    "                            <b>{{cart.getTotalCount()}}</b> items, <b>{{cart.getTotalPrice() | currency}}</b>\n" +
    "                            <span ng-show=\"cart.getTotalCount(product.sku) > 0\"><br />this item is in the cart</span>\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- buttons -->\n" +
    "        <div class=\"span4\">\n" +
    "            <button \n" +
    "                class=\"btn btn-block btn-success\" \n" +
    "                ng-click=\"cart.addItem(product.sku, product.name, product.price, 1)\">\n" +
    "                <i class=\"icon-shopping-cart icon-white\" /> add to cart\n" +
    "            </button>\n" +
    "            <button \n" +
    "                class=\"btn btn-block btn-danger\" \n" +
    "                ng-click=\"cart.addItem(product.sku, product.name, product.price, -10000)\"\n" +
    "                ng-disabled=\"cart.getTotalCount(product.sku) < 1\">\n" +
    "                <i class=\"icon-trash icon-white\" /> remove from cart\n" +
    "            </button>\n" +
    "            <button \n" +
    "                class=\"btn btn-block\" \n" +
    "                ng-click=\"changeCurrentView('store')\">\n" +
    "                <i class=\"icon-chevron-left\" /> back to store\n" +
    "            </button>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n" +
    "\n"
  );


  $templateCache.put('partials/shoppingCart.html',
    "<p class=\"text-info\">\n" +
    "    Thanks for shopping at the Angular Store.<br />\n" +
    "    This is your shopping cart. Here you can edit the items, \n" +
    "    go back to the store, clear the cart, or check out.\n" +
    "</p>\n" +
    "\n" +
    "<div class=\"container-fluid\">\n" +
    "    <div class=\"row-fluid\">\n" +
    "        <div class=\"span8\">\n" +
    "\n" +
    "            <!-- items -->\n" +
    "            <table class=\"table table-bordered\">\n" +
    "\n" +
    "                <!-- header -->\n" +
    "                <tr class=\"well\">\n" +
    "                    <td><b>Item</b></td>\n" +
    "                    <td class=\"tdCenter\"><b>Quantity</b></td>\n" +
    "                    <td class=\"tdRight\"><b>Price</b></td>\n" +
    "                    <td />\n" +
    "                </tr>\n" +
    "\n" +
    "                <!-- empty cart message -->\n" +
    "                <tr ng-hide=\"cart.getTotalCount() > 0\" >\n" +
    "                    <td class=\"tdCenter\" colspan=\"4\">\n" +
    "                        Your cart is empty.\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <!-- cart items -->\n" +
    "                <tr ng-repeat=\"item in cart.items | orderBy:'name'\">\n" +
    "                    <td>{{item.name}}</td>\n" +
    "                    <td class=\"tdCenter\">\n" +
    "                      <div class=\"input-append\">\n" +
    "                        <!-- use type=tel instead of  to prevent spinners -->\n" +
    "                        <input\n" +
    "                            class=\"span3 text-center\" type=\"tel\" \n" +
    "                            ng-model=\"item.quantity\" \n" +
    "                            ng-change=\"cart.saveItems()\" />\n" +
    "                        <button \n" +
    "                            class=\"btn btn-success\" type=\"button\" \n" +
    "                            ng-disabled=\"item.quantity >= 1000\"\n" +
    "                            ng-click=\"cart.addItem(item.sku, item.name, item.price, +1)\">+</button>\n" +
    "                        <button \n" +
    "                            class=\"btn btn-inverse\" type=\"button\" \n" +
    "                            ng-disabled=\"item.quantity <= 1\"\n" +
    "                            ng-click=\"cart.addItem(item.sku, item.name, item.price, -1)\">-</button>\n" +
    "                      </div>\n" +
    "                    </td>\n" +
    "                    <td class=\"tdRight\">{{item.price * item.quantity | currency}}</td>\n" +
    "                    <td class=\"tdCenter\" title=\"remove from cart\">\n" +
    "                        <a href=\"\" ng-click=\"cart.addItem(item.sku, item.name, item.price, -10000000)\" >\n" +
    "                            <i class=\"icon-remove\" />\n" +
    "                        </a>\n" +
    "                    </td>\n" +
    "                </tr>\n" +
    "\n" +
    "                <!-- footer -->\n" +
    "                <tr class=\"well\">\n" +
    "                    <td><b>Total</b></td>\n" +
    "                    <td class=\"tdCenter\"><b>{{cart.getTotalCount()}}</b></td>\n" +
    "                    <td class=\"tdRight\"><b>{{cart.getTotalPrice() | currency}}</b></td>\n" +
    "                    <td />\n" +
    "                </tr>\n" +
    "            </table>\n" +
    "        </div>\n" +
    "\n" +
    "        <!-- buttons -->\n" +
    "        <div class=\"span4\">\n" +
    "            <p class=\"text-info\">\n" +
    "                <button \n" +
    "                    class=\"btn btn-block\" \n" +
    "                    ng-click=\"changeCurrentView('store')\">\n" +
    "                    <i class=\"icon-chevron-left\" /> back to store\n" +
    "                </button>\n" +
    "                <button \n" +
    "                    class=\"btn btn-block btn-danger\" \n" +
    "                    ng-click=\"cart.clearItems()\" \n" +
    "                    ng-disabled=\"cart.getTotalCount() < 1\" >\n" +
    "                    <i class=\"icon-trash icon-white\" /> clear cart\n" +
    "                </button>\n" +
    "            </p>\n" +
    "\n" +
    "            <br /><br />\n" +
    "\n" +
    "            <p class=\"text-info\">\n" +
    "                <button\n" +
    "                    class=\"btn btn-block btn-primary\"\n" +
    "                    ng-click=\"cart.checkout('PayPal')\"\n" +
    "                    ng-disabled=\"cart.getTotalCount() < 1\">\n" +
    "                    <i class=\"icon-ok icon-white\" /> check out using PayPal\n" +
    "                </button>\n" +
    "                <button \n" +
    "                    class=\"btn btn-block btn-primary\" \n" +
    "                    ng-click=\"cart.checkout('Google')\" \n" +
    "                    ng-disabled=\"cart.getTotalCount() < 1\">\n" +
    "                    <i class=\"icon-ok icon-white\" /> check out using Google\n" +
    "                </button>\n" +
    "                <button \n" +
    "                    class=\"btn btn-block btn-primary\" \n" +
    "                    ng-click=\"cart.checkout('Stripe')\" \n" +
    "                    ng-disabled=\"cart.getTotalCount() < 1\">\n" +
    "                    <i class=\"icon-ok icon-white\" /> check out using Stripe\n" +
    "                </button>\n" +
    "            </p>\n" +
    "                <!-- Stripe needs a form to post to -->\n" +
    "                <form class=\"form-stripe\"></form>\n" +
    "\n" +
    "            <br /><br />\n" +
    "\n" +
    "            <p class=\"text-info\">\n" +
    "                <button \n" +
    "                    class=\"btn btn-block btn-link\"\n" +
    "                    ng-click=\"cart.checkout('PayPal')\"\n" +
    "                    ng-disabled=\"cart.getTotalCount() < 1\" >\n" +
    "                    <img src=\"https://www.paypal.com/en_US/i/btn/btn_xpressCheckout.gif\" alt=\"checkout PayPal\"/>\n" +
    "                </button>    \n" +
    "                <button \n" +
    "                    class=\"btn btn-block btn-link\" \n" +
    "                    ng-click=\"cart.checkout('Google')\" \n" +
    "                    ng-disabled=\"cart.getTotalCount() < 1\" >\n" +
    "                    <img src=\"https://checkout.google.com/buttons/checkout.gif?w=168&h=44&style=white&variant=text\" alt=\"checkoutGoogle\"/>\n" +
    "                </button>    \n" +
    "            </p>\n" +
    "        </div>\n" +
    "    </div>\n" +
    "</div>\n"
  );


  $templateCache.put('partials/store.html',
    "<p class=\"text-info\">\n" +
    "    Welcome to the Angular Store.<br />\n" +
    "    Please select the products you want and add them to your shopping cart.<br />\n" +
    "    When you are done, click the shopping cart icon to review your order and check out.\n" +
    "</p>\n" +
    "\n" +
    "<p>\n" +
    "    Search: <input ng-model=\"search\">\n" +
    "</p>\n" +
    "\n" +
    "<table class=\"table table-bordered\">\n" +
    "    <tr class=\"well\">\n" +
    "        <td class=\"tdRight\" colspan=\"4\" >\n" +
    "            <a href=\"\" ng-click=\"changeCurrentView('cart')\" title=\"go to shopping cart\" ng-disabled=\"cart.getTotalCount() < 1\">\n" +
    "                <i class=\"icon-shopping-cart\" />\n" +
    "                <b>{{cart.getTotalCount()}}</b> items, <b>{{cart.getTotalPrice() | currency}}</b>\n" +
    "            </a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr ng-repeat=\"product in store.products | orderBy:'name' | filter:search\" >\n" +
    "        <td class=\"tdCenter\"><img class=\"thumbnail\" ng-src=\"{{product.image}}\" alt=\"{{product.name}}\" /></td>\n" +
    "        <td>\n" +
    "            <a href=\"\" ng-click=\"changeCurrentView('product', product.sku)\"><b>{{product.name}}</b></a><br />\n" +
    "            {{product.description}}\n" +
    "        </td>\n" +
    "        <td class=\"tdRight\">\n" +
    "            {{product.price | currency}}\n" +
    "        </td>\n" +
    "        <td class=\"tdCenter\">\n" +
    "            <a href=\"\" ng-click=\"cart.addItem(product.sku, product.name, product.price, 1)\">\n" +
    "                add to cart\n" +
    "            </a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "    <tr class=\"well\">\n" +
    "        <td class=\"tdRight\" colspan=\"4\">\n" +
    "            <a href=\"\" ng-click=\"changeCurrentView('cart')\" title=\"go to shopping cart\" ng-disabled=\"cart.getTotalCount() < 1\">\n" +
    "                <i class=\"icon-shopping-cart\" />\n" +
    "                <b>{{cart.getTotalCount()}}</b> items, <b>{{cart.getTotalPrice() | currency}}</b>\n" +
    "            </a>\n" +
    "        </td>\n" +
    "    </tr>\n" +
    "</table>\n"
  );

}]);
