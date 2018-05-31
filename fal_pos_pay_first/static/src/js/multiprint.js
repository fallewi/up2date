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
        this.bill_locked = this.bill_locked || false;
    },
    // In case of XML failure to prevent,
    // We prevent on the back-end level

    // Order Button
    // This one is more save, bevause all action is handled and shown error message
    printChanges: function(){
        // Only manager / or Locked bill that are available to Print
        if (this.pos.user.role == "manager"){
            _super_order.printChanges.apply(this,arguments);
        }else{
            if (!this.bill_locked){
                this.pos.gui.show_popup('error-traceback', {
                    'title': _t('Restriction'),
                    'body':  _t("Cannot send order to kichen manually (Except manager)!\n Proceed to payment and the order will be sent automatically."),
                });
            }
            else{
                _super_order.printChanges.apply(this,arguments);
            }
        }
    },
    saveChanges: function(){
        // Only manager / or Locked bill that are available to Print
        if (this.pos.user.role == "manager"){
            _super_order.saveChanges.apply(this,arguments);
        }else{
            if (!this.bill_locked){
                this.pos.gui.show_popup('error-traceback', {
                    'title': _t('Restriction'),
                    'body':  _t("Cannot send order to kichen manually (Except manager)!\n Proceed to payment and the order will be sent automatically."),
                });
            }else{
                return _super_order.saveChanges.apply(this,arguments);
            }
        }
    },

    // Bill button
    // This one quite hard because the result receipt is being tried to be changed just after the code
    // Making it 100% error. With thi throw new error, at least a meesage is shown.
    export_for_printing: function(){
        // Only manager / or Locked bill that are available to Print
        if (this.pos.user.role == "manager"){
            return _super_order.export_for_printing.apply(this,arguments);
        }else{
            if (!this.bill_locked){
                this.pos.gui.show_popup('error-traceback', {
                    'title': _t('Restriction'),
                    'body':  _t("Cannot print bill manually (Except manager)!\n Proceed to payment and the order will be sent automatically."),
                });
                throw new Error("Cannot print bill manually (Except manager)!");
            }else{
                return _super_order.export_for_printing.apply(this,arguments);
            }
        }
    },

    export_as_JSON: function() {
        var json = _super_order.export_as_JSON.apply(this, arguments);
        if (this.bill_locked) {
            json.bill_locked = this.bill_locked;
        }
        return json;
    },
    init_from_JSON: function(json) {
        _super_order.init_from_JSON.apply(this, arguments);
        this.bill_locked = json.bill_locked;
    },
    assert_editable: function() {
        _super_order.assert_editable.apply(this, arguments);
        // Also Check for bill locked Except manager
        if (this.bill_locked && this.pos.user.role != "manager") {
            throw new Error('Billed Order cannot be modified');
        }
    },
});

});
