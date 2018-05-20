odoo.define('pos_restaurant_kitchen_screen', function (require) {
    var screens = require('point_of_sale.screens');
    var utils = require('web.utils');
    var round_pr = utils.round_precision;
    var floors = require('pos_restaurant.floors')

    floors.TableWidget.include({
        init: function(parent, options){
            this.pos = parent.pos;
            this._super(parent, options);
        },
        need_to_order: function (widget) {
            var orders = this.pos.get('orders').models;
            if (!orders) {
                return 0
            }
            var order = orders.find(function (order) {
                if (order.table) {
                    return order.table.id == widget.table.id;
                }
            })
            if (order) {
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line.state == 'Waiting-delivery') {
                        return 1;
                    }
                }
                return 0;
            } else {
                return 0;
            }
        },
        get_waiting_delivery: function (widget) {
            var orders = this.pos.get('orders');
            if (!orders) {
                return 0
            }
            var order = orders.find(function (order) {
                if (order.table) {
                    return order.table.id == widget.table.id;
                }
            })
            if (order) {
                var count = 0;
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line.state == 'Waiting-delivery') {
                        count += 1;
                    }
                }
                return count;
            } else {
                return 0;
            }
        },
        get_info_order: function (widget) {
            var result = {};
            var orders = this.pos.get('orders').models;
            var amount_total = '';
            var created_time = '';
            for (var i=0; i < orders.length; i++) {
                if (orders[i].table && orders[i].table.id == widget.table.id) {
                    created_time = orders[i].export_as_JSON().created_time;
                    amount_total = orders[i].export_as_JSON().amount_total;
                }
            }
            if (amount_total != '') {
                result['amount_total_str'] = this.get_amount_str(amount_total);
            } else {
                result['amount_total_str'] = amount_total;
            }
            result['created_time'] = created_time;
            return result;
        },
        get_amount_str: function (amount_total) {
            return round_pr(amount_total, this.pos.currency.rounding);
        },

        get_error: function (widget) {
            var orders = this.pos.get('orders');
            if (!orders) {
                return 0
            }
            var order = orders.find(function (order) {
                if (order.table) {
                    return order.table.id == widget.table.id;
                }
            })
            if (order) {
                var count = 0;
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line.state == 'Error') {
                        count += 1;
                    }
                }
                return count;
            } else {
                return 0;
            }
        },

    })

    screens.OrderWidget.include({ // sync from waiter to kitchen
        render_orderline: function (orderline) {
            var self = this;
            var el_node = this._super(orderline);
            var cancel_button = el_node.querySelector('.cancel');
            if (cancel_button) {
                cancel_button.addEventListener('click', function () {
                    orderline.set_state('Cancel');
                });
            }
            var done_button = el_node.querySelector('.done');
            if (done_button) {
                done_button.addEventListener('click', function () {
                    orderline.set_state('Done');
                });
            }
            var error_button = el_node.querySelector('.error');
            if (error_button) {
                error_button.addEventListener('click', function () {
                    orderline.set_state('Error');
                });
            }
            var priority_button = el_node.querySelector('.priority');
            if (priority_button) {
                priority_button.addEventListener('click', function () {
                    orderline.set_state('High-Priority');
                });
            }
            var confirm_button = el_node.querySelector('.confirm');
            if (confirm_button) {
                confirm_button.addEventListener('click', function () {
                    orderline.set_state('Confirmed');
                });
            }
            var put_back_button = el_node.querySelector('.put-back');
            if (put_back_button) {
                put_back_button.addEventListener('click', function () {
                    orderline.set_state('Waiting-delivery');
                });
            }
            return el_node;

        },
    })
    var ButtonHighPriority = screens.ActionButtonWidget.extend({
        template: 'ButtonHighPriority',
        button_click: function () {
            var order = this.pos.get('selectedOrder');
            if (order.orderlines.length > 0) {
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line.state != 'Kitchen confirmed cancel' && line.state != 'Done' && line.state != 'Cancel' && line.state != 'Error' && line.state != 'Waiting-delivery') {
                        line.set_state('High-Priority');
                    }
                }
            }
        },
    });
    screens.define_action_button({
        'name': 'ButtonHighPriority',
        'widget': ButtonHighPriority,
        'condition': function () {
            return this.pos.config.screen_type == 'waiter' || this.pos.config.screen_type == 'manager';
        }
    });
    var ButtonExitHighPriority = screens.ActionButtonWidget.extend({
        template: 'ButtonExitHighPriority',
        button_click: function () {
            var order = this.pos.get('selectedOrder');
            if (order.orderlines.length > 0) {
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line && line.state && line.state == 'High-Priority') {
                        line.set_state('Confirmed');
                    }
                }
            }
        },
    });
    screens.define_action_button({
        'name': 'ButtonExitHighPriority',
        'widget': ButtonExitHighPriority,
        'condition': function () {
            return this.pos.config.screen_type == 'waiter' || this.pos.config.screen_type == 'manager';
        }
    });

    var ButtonConfirm = screens.ActionButtonWidget.extend({
        template: 'ButtonConfirm',
        button_click: function () {
            var order = this.pos.get('selectedOrder');
            if (order.orderlines.length > 0) {
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line && line.state && line.state == 'Need-to-confirm') {
                        line.set_state('Confirmed');
                    }
                }
            }
            $('.order-submit').click();
        },
    });
    screens.define_action_button({
        'name': 'ButtonConfirm',
        'widget': ButtonConfirm,
        'condition': function () {
            return this.pos.config.screen_type == 'waiter';
        }
    });

    var ButtonDoneAll = screens.ActionButtonWidget.extend({
        template: 'ButtonDoneAll',
        button_click: function () {
            var order = this.pos.get('selectedOrder');
            if (order.orderlines.length > 0) {
                for (var i = 0; i < order.orderlines.models.length; i++) {
                    var line = order.orderlines.models[i];
                    if (line.state == 'Waiting-delivery') {
                        line.set_state('Done');
                    }
                }
            }
        },
    });
    screens.define_action_button({
        'name': 'ButtonDoneAll',
        'widget': ButtonDoneAll,
        'condition': function () {
            return this.pos.config.screen_type == 'waiter' || this.pos.config.screen_type == 'manager';
        }
    });
})