odoo.define('fal_pos_discount_restriction.pos_discount', function (require) {
"use strict";

var core = require('web.core');
var screens = require('point_of_sale.screens');

var _t = core._t;

var DiscountButtonManager = screens.ActionButtonWidget.extend({
    template: 'DiscountButtonManager',
    button_click: function(){
        var self = this;
        this.gui.show_popup('number',{
            'title': _t('Discount Percentage'),
            'value': this.pos.config.discount_pc,
            'confirm': function(val) {
                var admin_pin = this.pos.users[0].pos_security_pin
                if (!admin_pin){
                    admin_pin = '1234'
                }
                this.gui.ask_password(admin_pin).then(function(){
                    val = Math.round(Math.max(0,Math.min(100,val)));
                    self.apply_discount(val);
                });
            },
        });
    },
    apply_discount: function(pc) {
        var order    = this.pos.get_order();
        var lines    = order.get_orderlines();
        var product  = this.pos.db.get_product_by_id(this.pos.config.discount_product_id[0]);
        if (product === undefined) {
            this.gui.show_popup('error', {
                title : _t("No discount product found"),
                body  : _t("The discount product seems misconfigured. Make sure it is flagged as 'Can be Sold' and 'Available in Point of Sale'."),
            });
            return;
        }

        // Remove existing discounts
        var i = 0;
        while ( i < lines.length ) {
            if (lines[i].get_product() === product) {
                order.remove_orderline(lines[i]);
            } else {
                i++;
            }
        }

        // Add discount
        var discount = - pc / 100.0 * order.get_total_with_tax();

        if( discount < 0 ){
            order.add_product(product, { price: discount });
        }
    },
});

screens.define_action_button({
    'name': 'discount_manager',
    'widget': DiscountButtonManager,
    'condition': function(){
        return this.pos.config.module_pos_discount && this.pos.config.discount_product_id;
    },
});


});
