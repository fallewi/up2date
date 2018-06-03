odoo.define('fal_pos_kitchen_copy.multiprint', function (require) {
"use strict";

var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var mixins = require('web.mixins');
var Session = require('web.Session');

var QWeb = core.qweb;

models.load_fields("restaurant.printer", "checker_printer");
models.load_fields("restaurant.printer", "double_copy");

var _super_order = models.Order.prototype;
models.Order = models.Order.extend({
    // We need to intercept the changes name on
    // So we cannot call super on this
    printChanges: function(){
        var printers = this.pos.printers;
        for(var i = 0; i < printers.length; i++){
            var changes = this.computeChanges(printers[i].config.product_categories_ids);
            if ( changes['new'].length > 0 || changes['cancelled'].length > 0){
                // If printer are checker, put checker on the changes name
                if (printers[i].config.checker_printer){
                    changes['name'] += " [Checker]"
                }
                var receipt = QWeb.render('OrderChangeReceipt',{changes:changes, widget:this});
                printers[i].print(receipt);
                // If Printer are required double copy
                if (printers[i].config.double_copy){
                    changes['name'] += " [Copy]"
                    var receipt = QWeb.render('OrderChangeReceipt',{changes:changes, widget:this});
                    printers[i].print(receipt);
                }
            }
        }
    },

});

});
