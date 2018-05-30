odoo.define('fal_pos_pay_first.models', function (require) {
"use strict";

    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var core = require('web.core');
    var QWeb     = core.qweb;

    var _t = core._t;

   
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({

    initialize: function(attributes,options){
        _super_order.initialize.apply(this,arguments);
        this.bill_locked = false
    };

    // In case of XML failure to prevent,
    // We prevent on the back-end level

    // Order Button
    // This one is more save, bevause all action is handled and shown error message
    printChanges: function(){
        // Only manager / TO DO: order that has 100% payment and locked that has the possibility to send "kitchen order"
        if (this.pos.user.role == "manager"){
            _super_order.printChanges.apply(this,arguments);
        }else{
            this.pos.gui.show_popup('error-traceback', {
                'title': _t('Restriction'),
                'body':  _t("Cannot send order to kichen manually (Except manager)!\n Proceed to payment and the order will be sent automatically."),
            });
        }
    },
    saveChanges: function(){
        if (this.pos.user.role == "manager"){
            _super_order.saveChanges.apply(this,arguments);
        }else{
            this.pos.gui.show_popup('error-traceback', {
                'title': _t('Restriction'),
                'body':  _t("Cannot send order to kichen manually (Except manager)!\n Proceed to payment and the order will be sent automatically."),
            });
        }
    },

    // Bill button
    // This one quite hard because the result receipt is being tried to be changed just after the code
    // Making it 100% error. With thi throw new error, at least a meesage is shown.
    export_for_printing: function(){
        if (this.pos.user.role == "manager"){
            return _super_order.export_for_printing.apply(this,arguments);
        }else{
            this.pos.gui.show_popup('error-traceback', {
                'title': _t('Restriction'),
                'body':  _t("Cannot print bill manually (Except manager)!\n Proceed to payment and the order will be sent automatically."),
            });
            throw new Error("Cannot print bill manually (Except manager)!");
        }
    },
});

});
