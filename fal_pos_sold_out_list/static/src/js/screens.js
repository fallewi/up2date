odoo.define('fal_pos_sold_out_list.screens', function (require) {
    var screens = require('point_of_sale.screens');

    var core = require('web.core');
    var _t = core._t;

    screens.ProductScreenWidget.include({
        show: function(reset){
            var self = this;
            // Always try to check a new sold out products
            this.pos.load_new_sold_out_products().then(function(){
                for (product_id in self.pos.db.product_by_id){
                    if(self.pos.db.product_by_id[product_id].pos_sold_out){
                        var $elem = $("[data-product-id='"+product_id+"']");
                        $elem.addClass('sold-out');
                    }else{
                        var $elem = $("[data-product-id='"+product_id+"']");
                        if ($elem.hasClass('sold-out')){
                            $elem.removeClass('sold-out');
                        }
                    }
                }
            });
            this._super();
        },
        click_product: function(product) {
            var self = this;
            // Always try to check a new sold out products
            self.pos.load_new_sold_out_products().then(function(){
                if (!self.pos.db.product_by_id[product.id].pos_sold_out){
                    // Not sure why we lost the function to super
                    if(product.to_weight && this.pos.config.iface_electronic_scale){
                       self.gui.show_screen('scale',{product: product});
                    }else{
                       self.pos.get_order().add_product(product);
                    }
                } else{
                    self.gui.show_popup('error',{
                        'title': _t('Error: Item Sold Out'),
                        'body': _t("Item sold out, please contact your manager on duty."),
                    });
                }
            });
        },
    });

});