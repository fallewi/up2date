odoo.define('fal_pos_bus_sold_out_list.models', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    models.load_fields("product.product", "pos_sold_out");

    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        // reload the list of sold out item
        load_new_sold_out_products: function(){
            var self = this;
            var def  = new $.Deferred();
            var fields = ['id']
            var domain = [['sale_ok','=',true],['available_in_pos','=',true],['pos_sold_out', '=', true]];
            rpc.query({
                    model: 'product.product',
                    method: 'search_read',
                    args: [domain, fields],
                }, {
                    timeout: 3000,
                    shadow: true,
                })
                .then(function(products){
                    // Mark the product on db
                    for (product in self.db.product_by_id){
                        self.db.product_by_id[product].pos_sold_out = false
                        for (sold_out_product in products){
                            if (self.db.product_by_id[product].id == products[sold_out_product].id){
                                self.db.product_by_id[product].pos_sold_out = true
                            }
                        }
                    }
                    def.resolve();
                }, function(type,err){ def.reject(); });
            return def;
        },
    });

});
