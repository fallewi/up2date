odoo.define('fal_pos_bus_orderline_addons.models', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var core = require('web.core');
    var QWeb     = core.qweb;
    var utils = require('web.utils');

    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        // Addons product management
        add_addons_product: function(addons_product){
            _super_order_line.add_addons_product.apply(this,arguments);
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false)) {
                this.trigger_update_line();
            }
        },
        destroy_addons_product: function(){
            _super_order_line.destroy_addons_product.apply(this,arguments);
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false)) {
                this.trigger_update_line();
            }
        },

    });

});
