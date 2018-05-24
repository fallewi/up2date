odoo.define('fal_pos_orderline_addons.screens', function (require) {
"use strict";

var screens = require('point_of_sale.screens');
var core = require('web.core');
var utils = require('web.utils');

var rpc = require('web.rpc');

var QWeb     = core.qweb;

var _t = core._t;

screens.OrderWidget.include({
    // No super at this moment, TO DO: use super
    renderElement: function(scrollbottom){
        var order  = this.pos.get_order();
        if (!order) {
            return;
        }
        var orderlines = order.get_orderlines();

        var el_str  = QWeb.render('OrderWidget',{widget:this, order:order, orderlines:orderlines});

        var el_node = document.createElement('div');
            el_node.innerHTML = _.str.trim(el_str);
            el_node = el_node.childNodes[0];

        var list_container = el_node.querySelector('.orderlines');
        for(var i = 0, len = orderlines.length; i < len; i++){
            if (!orderlines[i].parent_product){
                var orderline = this.render_orderline(orderlines[i]);
                list_container.appendChild(orderline);
                for (var j = 0; j < orderlines[i].addons_products.length; j++){
                    for (var k = 0; k < orderlines.length; k++){
                        if (orderlines[i].addons_products[j] == orderlines[k].id){
                            var orderline = this.render_orderline(orderlines[k]);
                            list_container.appendChild(orderline);
                        }
                    }
                }
            }
        }

        if(this.el && this.el.parentNode){
            this.el.parentNode.replaceChild(el_node,this.el);
        }
        this.el = el_node;
        this.update_summary();

        if(scrollbottom){
            this.el.querySelector('.order-scroller').scrollTop = 100 * orderlines.length;
        }
    },
});

var AddonsButton = screens.ActionButtonWidget.extend({
    template: 'AddonsButton',
    button_click: function(){
        var self = this;
        var order  = this.pos.get_order();
        var selected_order_line = order.get_selected_orderline();
        if (order && !order.get_selected_orderline().product.is_topping_item){
            var list = [];
            for (product in this.pos.db.product_by_id){
                if(this.pos.db.product_by_id[product].is_topping_item){
                    list.push({
                        label: _t(this.pos.db.product_by_id[product].display_name),
                        item:  _t(this.pos.db.product_by_id[product].id),
                    });
                }
            }
            this.gui.show_popup('selection',{
                'title': _t('Select Topping(s)'),
                'list': list,
                'confirm': function(topping){
                    order.add_product(self.pos.db.product_by_id[topping], {quantity: 1});
                    // Register at the parent the addons product
                    selected_order_line.add_addons_product(order.get_last_orderline().id);
                    // Register at addons product the parent
                    order.get_last_orderline().set_parent_product(selected_order_line.id);
                },
            });
        }else{
            this.pos.gui.show_popup('error', {
                'title': _t('Restriction'),
                'body':  _t('No orderline Selected / product is a topping already.'),
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
