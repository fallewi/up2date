odoo.define('fal_pos_max_sell.sold_out', function (require) {
"use strict";
    var core = require('web.core');

    var _t = core._t;
    var _lt = core._lt;

	var chrome = require('point_of_sale.chrome');
    var MaxSellHeaderButtonWidget = chrome.HeaderButtonWidget

    var MaxSellHeaderButtonWidget = chrome.HeaderButtonWidget.extend({
        template: 'MaxSellHeaderButtonWidget',
    });

    // Add new Header widget to show sold out list
    chrome.Chrome.include({
        build_widgets: function () {
            // Get the location of Close button because we want to add the button just before it
            var close_button_seq = false
            for (var i = 0; i < this.widgets.length; i++){
                if (this.widgets[i].name == 'close_button'){
                    close_button_seq = i
                }
            }
            this.widgets.splice(close_button_seq, 0, {
                    'name':   'max_sell_button',
                    'widget': MaxSellHeaderButtonWidget,
                    'append':  '.pos-rightheader',
                    'args': {
                        label: _lt('Max Sale'),
                        action: function(){
                            var self = this;
                            self.pos.load_max_sell();
                        },
                    }
                });
            this._super();
        }
    });

})