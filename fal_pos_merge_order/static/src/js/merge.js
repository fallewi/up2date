odoo.define('fal_pos_merge_order.merge', function (require) {
"use strict";

	var models = require('point_of_sale.models');
    var core = require('web.core');
    var screens = require('point_of_sale.screens');

    var _t = core._t;

     var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        merge_order: function (order) {
            if (order){
                while (order.orderlines.models.length > 0 ){
                    this.add_orderline(order.orderlines.models[0])
                }
                order.destroy({'reason':'abandon'});
            }
        },
    });

    var ButtonMergeOrder = screens.ActionButtonWidget.extend({
        template: 'ButtonMergeOrder',
        button_click: function(){
            var self = this;
            var list = [];
            for (var i = 0; i < self.pos.get_table_orders(self.pos.get_order().table).length; i++) {
                var order = self.pos.get_table_orders(self.pos.get_order().table)[i]
                if (order != self.pos.get_order()){
                    list.push({
                        'label': order.sequence_number,
                        'item':  order,
                    });
                }
            }
            self.gui.show_popup('selection',{
                title: _t('Select order'),
                list: list,
                confirm: function (order) {
                    self.pos.get_order().merge_order(order)
                },
            });
        },
    });

    screens.define_action_button({
        'name': 'mergeorder',
        'widget': ButtonMergeOrder,
        'condition': function(){
            return true;
        },
    });

})