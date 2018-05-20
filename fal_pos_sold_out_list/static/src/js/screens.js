odoo.define('fal_pos_sold_out_list.screens', function (require) {
    var screens = require('point_of_sale.screens');

    var core = require('web.core');
    var _t = core._t;

    screens.ProductScreenWidget.include({
        show: function(reset){
            // Always try to check a new sold out products
            this.pos.load_new_sold_out_products();
            this._super();
        },
        click_product: function(product) {
            // Always try to check a new sold out products
            this.pos.load_new_sold_out_products();
            if(!product.pos_sold_out){
               this._super(product);
            }else{
                this.gui.show_popup('error',{
                    'title': _t('Error: Item Sold Out'),
                    'body': _t("Item sold out, please contact your manager on duty."),
                });
            }
        },
    });

});