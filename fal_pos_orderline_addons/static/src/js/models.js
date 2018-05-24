odoo.define('fal_pos_promotional_scheme.models', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var core = require('web.core');
    var QWeb     = core.qweb;

    var _t = core._t;

    models.load_fields("product.product", "is_topping_item");

    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function (attributes, options) {
            var self = this;
            _super_order_line.initialize.apply(this, arguments)
            this.parent_product = this.parent_product || "";
            this.addons_products = this.addons_products || [];
        },
        add_addons_product: function(addons_product){
            this.addons_products.push(addons_product);
            this.trigger('change',this);
        },
        get_addons_product: function(){
            return this.addons_products;
        },
        set_parent_product: function(parent_product){
            this.parent_product = parent_product;
            this.trigger('change',this);
        },
        get_parent_product: function(){
            return this.parent_product;
        },
        export_as_JSON: function(){
            var json = _super_order_line.export_as_JSON.call(this);
            json.parent_product = this.parent_product;
            json.addons_products = this.addons_products;
            return json;
        },
        init_from_JSON: function(json){
            _super_order_line.init_from_JSON.apply(this,arguments);
            this.parent_product = json.parent_product;
            this.addons_products = json.addons_products;
        },
    });

});
