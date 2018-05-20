odoo.define('client_get_notify_falinwa', function (require) {
	var models = require('point_of_sale.models');
    var _super_posmodel = models.PosModel.prototype;
	models.PosModel = models.PosModel.extend({
        syncing_sessions: function (message) {
            var res = _super_posmodel.syncing_sessions.apply(this, arguments);
            if (message['action'] == 'set_owner') {
                this.sync_set_owner(message['data']);
            }
            return res;
        },
		sync_set_owner: function (vals) {
            var owner_id = vals['owner_user_id'];
            var uid = vals['uid'];
            var order = this.get_order_by_uid(uid)
            if (!order) {
                return;
            }
            order.syncing = true;
            order.set_owner(owner_id)
            order.trigger('change', order)
            order.syncing = false;
        },
	});
})