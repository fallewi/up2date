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

        this.$('.paidnorder').click(function(){
            // Should be able to call using the button click

            // Order Print
            var order = this.pos.get_order();
            if(order.hasChangesToPrint()){
                    order.printChanges();
                    order.saveChanges();
                }
            });

            // Bill Print
            if (!this.pos.config.iface_print_via_proxy) {
                this.gui.show_screen('bill');
            } else {
                if(order.get_orderlines().length > 0){
                    var receipt = order.export_for_printing();
                    receipt.bill = true;
                    this.pos.proxy.print_receipt(QWeb.render('BillReceipt',{
                        receipt: receipt, widget: this, pos: this.pos, order: order,
                    }));
                }
            }
    },
});

});
