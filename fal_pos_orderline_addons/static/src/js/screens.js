odoo.define('fal_pos_orderline_addons.screens', function (require) {
"use strict";

var screens = require('point_of_sale.screens');
var core = require('web.core');
var utils = require('web.utils');

var rpc = require('web.rpc');

var QWeb     = core.qweb;

var _t = core._t;

var AddonsButton = screens.ActionButtonWidget.extend({
    template: 'AddonsButton',
    button_click: function(){
        var self = this;
        var order  = this.pos.get_order();
        var selected_order_line = order.get_selected_orderline();
        if (order && selected_order_line){
            var available_topping = selected_order_line.get_product().available_topping_product_ids
            var list = [];
            for (product in available_topping){
                if(this.pos.db.product_by_id[available_topping[product]].is_topping_item){
                    list.push({
                        label: _t(this.pos.db.product_by_id[available_topping[product]].display_name),
                        item:  _t(this.pos.db.product_by_id[available_topping[product]].id),
                    });
                }
            }
            list.push({
                label: _t("Cancel topping"),
                item:  _t('cancel'),
            });
            this.gui.show_popup('selection',{
                'title': _t('Select Topping(s)'),
                'list': list,
                'confirm': function(topping){
                    if (topping != 'cancel'){
                        selected_order_line.add_addons_product(topping);
                    }else{
                        self.gui.show_popup('confirm',{
                            'title': _t('Cancel All Topping?'),
                            'body': _t('You will lose all topping that is related to this orderline'),
                            confirm: function(){
                                selected_order_line.destroy_addons_product()
                            },
                        });
                    }
                },
            });
        }else{
            this.pos.gui.show_popup('error', {
                'title': _t('Restriction'),
                'body':  _t('No orderline Selected.'),
            });
        }
    },
});

screens.define_action_button({
    'name': 'addonsproduct',
    'widget': AddonsButton,
    'condition': function(){
        return true;
    },
});

});
