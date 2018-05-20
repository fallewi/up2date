odoo.define('fal_pos_sold_out_list.sold_out', function (require) {
"use strict";
    var core = require('web.core');

    var _t = core._t;
    var _lt = core._lt;

	var chrome = require('point_of_sale.chrome');
    var SoldOutHeaderButtonWidget = chrome.HeaderButtonWidget

    var SoldOutHeaderButtonWidget = chrome.HeaderButtonWidget.extend({
        template: 'SoldOutHeaderButtonWidget',
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
                    'name':   'sold_out_button',
                    'widget': SoldOutHeaderButtonWidget,
                    'append':  '.pos-rightheader',
                    'args': {
                        label: _lt('Sold Out'),
                        action: function(){
                            var self = this;
                            self.gui.show_popup('selection',{
                                title: _t('Sold Out List'),
                                list: [
                                    {label: 'A',  item: 0},
                                    {label: 'B',  item: 1}],
                            });
                        },
                    }
                });
            this._super();
        }
    });

})