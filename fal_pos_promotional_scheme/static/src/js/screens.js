odoo.define('fal_pos_promotional_scheme.screens', function (require) {
"use strict";

var screens = require('point_of_sale.screens');
var core = require('web.core');
var utils = require('web.utils');

var rpc = require('web.rpc');

var QWeb     = core.qweb;

var _t = core._t;

var PromoSchemeButton = screens.ActionButtonWidget.extend({
    template: 'PromoSchemeButton',
    button_click: function(){
        var self = this;
        var order  = this.pos.get_order();
        if (order){
            var list = [];
            for (var i = 0; i < this.pos.schemes.length; i++) {
                list.push({
                    label: this.pos.schemes[i].name,
                    item:  this.pos.schemes[i],
                });
            }
            list.push({
                label: _t('Cancel all Scheme'),
                item:  'cancel_scheme',
            });
            this.gui.show_popup('selection',{
                'title': _t('Select a promotional scheme'),
                'list': list,
                'confirm': function(scheme){
                    if (scheme != 'cancel_scheme'){
                        var args = [{scheme_id: scheme.id, total_sale: order.get_total_with_tax()}]
                        rpc.query({
                            model: 'fal.pos.promotional.scheme',
                            method: 'rule_satisfied',
                            args: args,
                        }).then(function (result) {
                            if (scheme.scheme_type == 'product'){
                                if (result > 0){
                                    self.pos.user.skip_assert_promo = true
                                    order.add_product(self.pos.db.product_by_id[scheme.product_id[0]], {quantity: result});
                                    order.get_last_orderline().set_scheme(scheme);
                                    self.pos.user.skip_assert_promo = false
                                } else {
                                    self.gui.show_popup('error',{
                                        'title': _t('Error: Cannot apply the promo'),
                                        'body': _t("Sorry, this order doesn't qualify for the promotional scheme. If you are sure that this should be possible, please contact the responsible manager."),
                                    });
                                }
                            }
                        }).fail(function (type, error) {
                            self.pos.gui.show_popup('error-traceback', {
                                'title': error.data.message,
                                'body': error.data.debug
                            });
                        });
                    } else {
                        self.gui.show_popup('confirm',{
                            'title': _t('Destroy All Scheme?'),
                            'body': _t('You will lose all orderline that is based on promotional scheme'),
                            confirm: function(){
                                var orderlines = order.get_orderlines()
                                for (var i = 0; i < orderlines.length; i++){
                                    if (orderlines[i].get_scheme()){
                                        order.remove_orderline(orderlines[i])
                                        i--;
                                    }
                                }
                            },
                        });
                    }
                },
            });
        }
    },
});

screens.define_action_button({
    'name': 'promoscheme',
    'widget': PromoSchemeButton,
    'condition': function(){
        return true;
    },
});

});
