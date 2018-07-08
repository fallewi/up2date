odoo.define('fal_pos_discount_restriction.screens', function (require) {
"use strict";

    var screens = require('point_of_sale.screens');
    var rpc = require('web.rpc');

    var discountButtonWidget = require('pos_discount.pos_discount');

    var core = require('web.core');
    var QWeb     = core.qweb;

    var _t = core._t;

    screens.NumpadWidget.include({
        applyAccessRights: function() {
            this._super();
            var has_price_control_rights = !this.pos.config.restrict_price_control || this.pos.get_cashier().role == 'manager';
            this.$el.find('.mode-button[data-mode="discount"]')
                .toggleClass('disabled-mode', !has_price_control_rights)
                .prop('disabled', !has_price_control_rights);
        },
    });

});
