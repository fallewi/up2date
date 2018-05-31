odoo.define('fal_pos_pay_first.screens', function (require) {
"use strict";

var screens = require('point_of_sale.screens');
var core = require('web.core');
var utils = require('web.utils');

var rpc = require('web.rpc');

var QWeb     = core.qweb;

var _t = core._t;

var PaymentScreenWidget = screens.PaymentScreenWidget.include({
    renderElement: function() {
        var self = this;
        this._super();
        //////////////////////////////////////////////////////
        // This button will call the bill print + kitchen order
        // After this button is clicked, the order is finished
        // LOCK all the possible change on payment & Item
        /////////////////////////////////////////////////////
        this.$('.paidnorder').click(function(){
            // Should be able to call using the button click

            // Order
            var order = self.pos.get_order();
            if (order && order.is_paid()){
                order.bill_locked = true
                // Kitchen Print
                if (order.hasChangesToPrint()){
                    order.printChanges();
                    order.saveChanges();
                }

                // Bill Print
                if (!self.pos.config.iface_print_via_proxy) {
                    self.gui.show_screen('bill');
                } else {
                    if(order.get_orderlines().length > 0){
                        var receipt = order.export_for_printing();
                        receipt.bill = true;
                        self.pos.proxy.print_receipt(QWeb.render('BillReceipt',{
                            receipt: receipt, widget: self, pos: self.pos, order: order,
                        }));
                    }
                }
                // After printing, go back to product screen
                self.pos.set_table(null);
            }
        });
    },
     order_changes: function(){
        var self = this;
        self._super();
        var order = self.pos.get_order();
        if (!order) {
            return;
        } else if (order.is_paid()) {
            self.$('.paidnorder').addClass('highlight');
        }else{
            self.$('.paidnorder').removeClass('highlight');
        }

    },
});

});
