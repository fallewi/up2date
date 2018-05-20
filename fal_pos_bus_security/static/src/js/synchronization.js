odoo.define('fal_pos_bus_security.synchronization', function (require) {

    var exports = require('pos_bus.synchronization');
    var session = require('web.session');

    var _super_bus = exports.bus.prototype;
    exports.bus = exports.bus.extend({

        push_message_to_other_sessions: function (value) {
            // Add counter of order log history
            // If exceeding 250 (still a guess number) auto remove the order
            var res = _super_bus.push_message_to_other_sessions.apply(this, arguments);
            // If we get to this part, it means that the "Do sync backend is done"
            var order = this.pos.get_order_by_uid(value['order_uid'])
            if (order){
                order.log_history += 1;
                if (order.orderlines.length == 0){
                    order.last_empty_time = new Date();
                }else{
                    order.last_empty_time = false;
                }
                if (order.log_history > 250){
                    this.pos.delete_current_order();
                }
            }
            return res;
        },
    });
    return exports;
});
