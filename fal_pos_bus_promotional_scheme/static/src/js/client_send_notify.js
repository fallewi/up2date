odoo.define('client_send_notify_fal_pos_bus_promotional_scheme', function (require) {
    var models = require('point_of_sale.models');
    var core = require('web.core');
    var _t = core._t;

    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        set_scheme: function(scheme){
            _super_order_line.set_scheme.apply(this, arguments);
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false)) {
                this.trigger_update_line();
            }
        },
    });
})
