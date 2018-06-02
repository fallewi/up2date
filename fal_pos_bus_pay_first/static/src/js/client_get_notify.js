odoo.define('client_get_notify_fal_pos_bus_pay_first', function (require) {
	var models = require('point_of_sale.models');
    var _super_posmodel = models.PosModel.prototype;
	models.PosModel = models.PosModel.extend({
        syncing_sessions: function (message) {
            var res = _super_posmodel.syncing_sessions.apply(this, arguments);
            if (message['action'] == 'set_bill_locked') {
                this.sync_bill_locked(message['data']);
            }
            return res;
        },
		sync_bill_locked: function (vals) {
            var bill_locked = vals['bill_locked'];
            var uid = vals['uid'];
            var order = this.get_order_by_uid(uid)
            if (!order) {
                return;
            }
            order.syncing = true;
            order.set_bill_locked(bill_locked)
            order.trigger('change', order)
            order.syncing = false;
        },
	});
})