odoo.define('fal_pos_promotional_scheme.models', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var core = require('web.core');
    var QWeb     = core.qweb;

    var _t = core._t;

    models.load_fields("product.product", "is_promotional_item");

    models.load_models({
        model: 'fal.pos.promotional.scheme',
        fields: ['name', 'scheme_type', 'product_id', 'product_uom_qty', 'repeatable', 'active'],
        domain: function (self) {
            return [['active', '=', true]];
        },
        loaded: function (self, schemes) {
            self.schemes = schemes;
            self.scheme_by_id = {};
            for (var i = 0; i < schemes.length; i++) {
                self.scheme_by_id[schemes[i].id] = schemes[i].name;
            }
        },
    });

    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        load_orders: function () {
            var self = this;
            this.the_first_load = true;
            _super_posmodel.load_orders.apply(this, arguments);
            this.the_first_load = false;
        },

    });

    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function (attributes, options) {
            var self = this;
            _super_order_line.initialize.apply(this, arguments)
            this.scheme = this.scheme || "";
        },
        assert_promo_item: function() {
            // If.promo item, don't let non-manager to add / modify
            if (!this.pos.the_first_load){
                if (this.product.is_promotional_item && this.pos.user.role != 'manager' && !this.pos.user.skip_assert_promo){
                    this.pos.gui.show_popup('error', {
                        'title': _t('Restriction'),
                        'body':  _t('Cannot change Promotional Item. Ask your manager on duty!'),
                    });
                    return false
                }
            }
            return true
        },
        set_scheme: function(scheme){
            this.scheme = scheme;
            this.trigger('change',this);
        },
        get_scheme: function(scheme){
            return this.scheme;
        },
        set_quantity: function (quantity, keep_price) {
            if (this.assert_promo_item()){
                var res = _super_order_line.set_quantity.apply(this, arguments);
                return res
            };
            return false
        },
        set_discount: function (discount) {
            if (this.assert_promo_item()){
                var res = _super_order_line.set_discount.apply(this, arguments);
                return res
            };
            return false
        },
        set_unit_price: function (price) {
            if (this.assert_promo_item()){
                var res = _super_order_line.set_unit_price.apply(this, arguments);
                return res
            };
            return false
        },
        export_as_JSON: function(){
            var json = _super_order_line.export_as_JSON.call(this);
            json.scheme = this.scheme;
            return json;
        },
        init_from_JSON: function(json){
            _super_order_line.init_from_JSON.apply(this,arguments);
            this.scheme = json.scheme;
        },
    });

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        add_product: function(product, options){
            var self = this;
            if (!this.pos.the_first_load){
                if (product.is_promotional_item && this.pos.user.role != 'manager' && !this.pos.user.skip_assert_promo){
                    this.pos.gui.show_popup('error', {
                        'title': _t('Restriction'),
                        'body':  _t('Cannot change Promotional Item. Ask your manager on duty!'),
                    });
                }
            }
            _super_order.add_product.apply(this, arguments);
        },
    });
});
