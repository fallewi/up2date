odoo.define('fal_pos_bus_security.chrome', function (require) {
"use strict";

var chrome = require('point_of_sale.chrome');
var PosBaseWidget = require('point_of_sale.BaseWidget');
var gui = require('point_of_sale.gui');
var keyboard = require('point_of_sale.keyboard');
var models = require('point_of_sale.models');
var core = require('web.core');


var _t = core._t;
var _lt = core._lt;
var QWeb = core.qweb;

chrome.OrderSelectorWidget.include({

    // When you want to delete order, a password request will pop up
    deleteorder_click_handler: function(event, $el) {
        var self  = this;
        var order = this.pos.get_order();
        if (!order) {
            return;
        } else if ( !order.is_empty() ){
            this.gui.ask_password(this.pos.pos_session.session_password).then(function(){
                self.gui.show_popup('confirm',{
                    'title': _t('Destroy Current Order ?'),
                    'body': _t('You will lose any data associated with the current order'),
                    confirm: function(){
                        self.pos.delete_current_order();
                    },
                });
            });

        } else {
            this.pos.delete_current_order();
        }
    },
});

return chrome;
});