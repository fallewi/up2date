odoo.define('client_send_notify_fal_pos_bus_promotional_scheme', function (require) {
    var models = require('point_of_sale.models');
    var core = require('web.core');
    var _t = core._t;

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        set_bill_locked: function(bill_locked){
            _super_order.set_bill_locked.apply(this, arguments);
            if ((!this.syncing || this.syncing == false) && (this.uid)) {
                if (bill_locked) {
                    var order = this.export_as_JSON();
                    this.pos.pos_bus.push_message_to_other_sessions({
                        data: {
                            uid: this.uid,
                            bill_locked: bill_locked,
                        },
                        action: 'set_bill_locked',
                        bus_id: this.pos.config.bus_id[0],
                        order_uid: order['uid'],
                    });
                }
            }
        },
    });
})
