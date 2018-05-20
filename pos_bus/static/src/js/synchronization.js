odoo.define('pos_bus.synchronization', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');
    var exports = {}
    var Backbone = window.Backbone;
    var bus = require('bus.bus');
    var core = require('web.core');
    var _t = core._t;
    var session = require('web.session');
    var db = require('point_of_sale.DB');

    exports.bus = Backbone.Model.extend({
        initialize: function (pos) {
            var self = this;
            this.pos = pos;
            this.stop = false;
            setInterval(function () {
                self.repush_to_another_sessions();
            }, 5000);
        },

        push_message_to_other_sessions: function (value) {
            if (this.pos.the_first_load || this.pos.the_first_load == undefined || !this.pos.config.bus_id) { // when cashier come back pos screen (reload browse) no need sync data
                return;
            }
            var self = this;
            if (!value['order_uid']) {
                return;
            }
            var message = {
                user_send_id: this.pos.user.id,
                value: value,
            };
            var params = {
                bus_id: self.pos.config.bus_id[0],
                messages: [message],
            };
            var sending = function () {
                return session.rpc("/pos/sync", params);
            };
            return sending().fail(function (error, e) {
                console.error('----------------------------------');
                console.error(error);
                console.error(e);
                console.error('----------------------------------');
                if (error.message == "XmlHttpRequestError ") {
                    self.pos.db.add_datas_false(message);
                }
                // Falinwa Addons
                // If fail just reload the POS System
                self.pos.gui.show_popup('error-traceback',{
                    'title': "Network Error",
                    'body':  "System Will auto restart to re-sync everything."
                });
                localStorage.clear();
                setTimeout(function () {
                    location.reload();
                }, 3000);
            }).done(function () {
                console.log('{sync going}');
                self.pos.trigger('reload:kitchen_screen');
            })

        },

        get_message_from_other_sessions: function (messages) {
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                if (!message || message.length < 2) {
                    continue;
                }
                var channel = message[0][1];
                if (message[0] && channel && channel == 'pos.bus') {
                    var message = JSON.parse(message[1]);
                    this.pos.syncing_sessions(message['value']);
                }
            }
        },

        start: function () {
            this.bus = bus.bus;
            this.bus.last = this.pos.db.load('bus_last', 0);
            this.bus.on("notification", this, this.get_message_from_other_sessions);
            this.bus.start_polling();
        },
        notify: function () {
            this.pos.gui.show_popup('error', {
                'title': _t('!!! Warning !!!'),
                'body': _t("Your internet have problem or Odoo Server just shutdown, sync not work. You can create new orders only. Please dont update client, quantity, price or discount of old order lines. If you change,your order lines will have something wrong when sync come back. Current times better than if 1 session only keep 1 order Example:POS Client 1 Keep order 1,2,3 and POS Client 2 keep order 3,4,5."),
            });
        },
        repush_to_another_sessions: function () {
            var self = this;
            if (!self.pos.config.bus_id) {
                return;
            }
            var datas_false = this.pos.db.get_datas_false();
            if (datas_false && datas_false.length) {
                var sending = function () {
                    return session.rpc("/pos/sync", {
                        bus_id: self.pos.config.bus_id[0],
                        messages: datas_false,
                    });
                };
                sending().fail(function (error, e) {
                    console.error('No internet');
                    self.notify();
                }).done(function (sequence) {
                    for (var i = 0; i < datas_false.length; i++) {
                        self.pos.db.remove_data_false(datas_false[i]['sequence']);
                    }
                    self.pos.gui.show_popup('alert', {
                        title: 'System comeback',
                        body: 'Odoo Connection has come back, syncing between sessions will work well'
                    });
                })
            }
        }
    });

    db.include({
        init: function (options) {
            this._super(options);
            this.sequence = 1;
        },

        add_datas_false: function (data) {
            var datas_false = this.load('datas_false', []);
            this.sequence += 1
            data['sequence'] = this.sequence
            datas_false.push(data);
            this.save('datas_false', datas_false);
        },

        get_datas_false: function () {
            var datas_false = this.load('datas_false');
            if (datas_false && datas_false.length) {
                return datas_false
            } else {
                return []
            }
        },

        remove_data_false: function (sequence) {
            var datas_false = this.load('datas_false', []);
            var datas_false_new = _.filter(datas_false, function (data) {
                return data['sequence'] !== sequence;
            });
            this.save('datas_false', datas_false_new);
        }
    });

    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({

        isEmpty: function (obj) {
            return Object.keys(obj).length === 0;
        },
        load_orders: function () {
            var self = this;
            this.the_first_load = true;
            _super_posmodel.load_orders.apply(this, arguments);
            this.the_first_load = false;
            if (this.config.bus_id && this.bus_logs && this.bus_logs.length) {
                for (var i = 0; i < this.bus_logs.length; i++) {
                    var log = this.bus_logs[i];
                    this.syncing_sessions(log['value']);
                }
            }
        },
        on_removed_order: function (removed_order, index, reason) { // no need change screen when syncing remove order
            if (removed_order.syncing == true) {
                return;
            } else {
                var res = _super_posmodel.on_removed_order.apply(this, arguments);
            }
        },
        get_order_by_uid: function (uid) {
            var orders = this.get('orders').models;
            var order = orders.find(function (order) {
                return order.uid == uid;
            });
            return order;
        },
        get_line_by_uid: function (uid) {
            var line_by_uid = [];
            var orders = this.get('orders').models;
            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                for (var j = 0; j < order.orderlines.models.length; j++) {
                    line_by_uid[order.orderlines.models[j]['uid']] = order.orderlines.models[j];
                }
            }
            return line_by_uid[uid];
        },
        syncing_sessions: function (message) {
            var action = message['action'];
            console.log('{sync coming} ' + action);
            if (action == 'selected_order') {
                this.sync_selected_order(message['data']);
            }
            if (action == 'new_order') {
                this.sync_order_adding(message['data']);
            }
            if (action == 'unlink_order') {
                this.sync_order_removing(message['data']);
            }
            if (action == 'line_removing') {
                this.sync_line_removing(message['data']);
            }
            if (action == 'set_client') {
                this.sync_set_client(message['data']);
            }
            if (action == 'trigger_update_line') {
                this.sync_trigger_update_line(message['data']);
            }
            if (action == 'change_pricelist') {
                this.sync_change_pricelist(message['data']);
            }
            if (action == 'sync_sequence_number') {
                this.pos_session.sequence_number = message['data']['sequence_number'];
            }
        },
        check_order_have_exist: function (val) {
            var orders = this.get('orders', []);
            var orders_exist = _.filter(orders.models, function (order) {
                return order['uid'] === val['uid'];
            });
            if (orders_exist.length == 0) {
                return false
            } else {
                return true
            }
        },
        sync_selected_order: function (vals) {
            if (!this.config.is_customer_screen) {
                return;
            }
            var order_exist = this.check_order_have_exist(vals);
            if (!order_exist) {
                return null;
            } else {
                var order = this.get_order_by_uid(vals['uid']);
                if (order) {
                    this.set('selectedOrder', order);
                }
            }
        },
        sync_order_adding: function (vals) {
            var orders = this.get('orders', []);
            var order_exist = this.check_order_have_exist(vals);
            if (order_exist) {
                return;
            }
            if (vals.floor_id && vals.table_id) {
                // neu config nay co ban thi add vao
                // khong thi thoi
                if (this.floors_by_id[vals.floor_id] && this.tables_by_id[vals.table_id]) {
                    var table = this.tables_by_id[vals.table_id];
                    var floor = this.floors_by_id[vals.floor_id];
                    var orders = this.get('orders');
                    if (table && floor) {
                        var order = new models.Order({}, {pos: this, json: vals});
                        this.order_sequence += 1;
                        order.syncing = true;
                        orders.add(order);
                        order.trigger('change', order);
                        order.syncing = false;
                    }
                }
            } else {
                // neu data nhận vào không có floor ID và table ID
                // nhưng bản thân session này có floor và table thì cũng ko cho sync
                if (this.floors != undefined) {
                    if (this.floors.length > 0) {
                        console.error('session nay co floor vaf table, nhung data send me khong co floor ID and table ID');
                        return null;
                    }
                }
                var order = new models.Order({}, {pos: this, json: vals});
                this.order_sequence += 1;
                order.syncing = true;
                orders.add(order);
                order.trigger('change', order);
                order.syncing = false;
                if (orders.length == 1) {
                    this.set('selectedOrder', order);
                }
            }
        },
        sync_order_removing: function (uid) {
            var order = this.get_order_by_uid(uid);
            if (order) {
                order.syncing = true;
                this.db.remove_order(order.id);
                order.destroy({'reason': 'abandon'});
                this.order_sequence -= 1;
            }
        },
        sync_line_removing: function (vals) {
            var line = this.get_line_by_uid(vals['uid']);
            if (line) {
                line.syncing = true;
                line.order.orderlines.remove(line);
                line.order.trigger('change', line.order)
                line.syncing = false;
            }
        },
        sync_set_client: function (vals) {
            var partner_id = vals['partner_id'];
            var uid = vals['uid'];
            var order = this.get_order_by_uid(uid)
            if (!partner_id) {
                order.syncing = true;
                order.set_client(null);
                order.syncing = false;
                return order.trigger('change', order)
            }
            var client = this.db.get_partner_by_id(partner_id);
            if (!order) {
                return false
            }
            if (partner_id && !client) {
                var self = this;
                var fields = _.find(this.models, function (model) {
                    return model.model === 'res.partner';
                }).fields;
                return rpc.query({
                    model: 'res.partner',
                    method: 'search_read',
                    args: [[['id', '=', partner_id]]],
                }, {
                    timeout: 3000,
                    shadow: true
                }).then(function (partners) {
                    if (partners.length == 1) {
                        self.db.add_partners(partners)
                        order.syncing = true;
                        order.set_client(partners[0])
                        order.trigger('change', order)
                        order.syncing = false;
                    } else {
                        console.log('Loading new partner fail networking')
                    }
                }).fail(function (type, error) {
                    if (error.code === 200) {
                        self.gui.show_popup('error-traceback', {
                            'title': error.data.message,
                            'body': error.data.debug
                        });
                    }
                });
            } else {
                order.syncing = true;
                order.set_client(client)
                order.trigger('change', order)
                order.syncing = false;
            }
        },
        sync_trigger_update_line: function (vals) {
            var line = this.get_line_by_uid(vals['uid']);
            var product = this.db.get_product_by_id(vals['line']['product_id'])
            var order = this.get_order_by_uid(vals['line']['order_uid'])
            if (line) {
                line.syncing = true;
                if (line.order.selected_orderline && line.order.selected_orderline.uid == line.uid) {
                    line.order.selected_orderline = undefined;
                }
                line.order.orderlines.remove(line);
                line.order.trigger('change', line.order)
                line.syncing = false;
            }
            if (order && product) {
                order.syncing = true;
                var new_line = new models.Orderline({}, {
                    pos: this,
                    order: order,
                    product: product,
                    json: vals['line']
                });
                if (vals['line']['is_return']) {
                    new_line.set_quantity(-new_line.quantity)
                }
                order.orderlines.add(new_line);
                order.trigger('change', order);
                order.syncing = false;
            }
        },

        sync_change_pricelist: function (vals) {
            var order = this.get_order_by_uid(vals['uid'])
            var pricelist = _.findWhere(this.pricelists, {id: vals['pricelist']['id']});
            if (order && pricelist) {
                order.pricelist = pricelist
                order.trigger('change', order)
            }
        },

        // active sync or not
        load_server_data: function () {
            var self = this;
            return _super_posmodel.load_server_data.apply(this, arguments).then(function () {
                if (self.config.bus_id) {
                    self.chrome.loading_message(_t('Active sync between sessions'), 1);
                    var bus_log = rpc.query({
                        model: 'pos.bus.log',
                        method: 'api_get_data',
                        args: [self.config.bus_id[0], self.user.id],
                    });
                    self.pos_bus = new exports.bus(self);
                    self.pos_bus.start(); // start syncing between sessions
                    return bus_log.then(function (messages) {
                        self.bus_logs = messages;
                    })
                }
            })
        },

        session_info: function () {
            var user;
            if (this.get('cashier')) {
                user = this.get('cashier');
            } else {
                user = this.user;
            }
            return {
                'bus_id': this.config.bus_id[0],
                'user': {
                    'id': user.id,
                    'name': user.name,
                },
                'pos': {
                    'id': this.config.id,
                    'name': this.config.name,
                },
                'date': new Date().toLocaleTimeString(),
            }
        },
        get_session_info: function () {
            var order = this.get_order();
            if (order) {
                return order.get_session_info();
            }
            return null;
        }
    });

    // Model Order
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function (attributes, options) {
            var self = this;
            var res = _super_order.initialize.apply(this, arguments);
            if (!this.created_time) {
                this.created_time = new Date().toLocaleTimeString();
            }
            if (this.pos.pos_bus) {
                this.bind('add', function (order) { // syncing New order
                    if ((self.pos.the_first_load == false || !self.pos.the_first_load) && (order.syncing != true || !order.syncing) && (order.temporary == false || !order.temporary) && self.pos.config.bus_id && self.pos.config.bus_id[0]) {
                        self.pos.pos_bus.push_message_to_other_sessions({
                            data: order.export_as_JSON(),
                            action: 'new_order',
                            bus_id: self.pos.config.bus_id[0],
                            order_uid: order['uid']
                        });
                        self.pos.pos_bus.push_message_to_other_sessions({
                            data: {
                                sequence_number: self.pos.pos_session.sequence_number
                            },
                            action: 'sync_sequence_number',
                            bus_id: self.pos.config.bus_id[0],
                            order_uid: order['uid']
                        });
                    }

                });
                this.bind('remove', function (order) { // syncing remove order
                    if ((order.syncing != true || !order.syncing) && self.pos.config.bus_id && self.pos.config.bus_id[0]) {
                        self.pos.pos_bus.push_message_to_other_sessions({
                            data: order.uid,
                            action: 'unlink_order',
                            bus_id: self.pos.config.bus_id[0],
                            order_uid: order['uid']
                        });
                    }
                });
                this.orderlines.bind('add', function (line) {
                    if (line.order.temporary == false && (!line.order.syncing || line.order.syncing == false) && self.pos.config.bus_id[0]) {
                        line.trigger_update_line();
                    }
                })
            }
            return res;
        },
        get_session_info: function () {
            return this.session_info;
        },
        set_client: function (client) {
            var res = _super_order.set_client.apply(this, arguments);
            if ((!this.syncing || this.syncing == false) && this.pos.pos_bus) {
                var order = this.export_as_JSON()
                if (client) {
                    this.pos.pos_bus.push_message_to_other_sessions({
                        data: {
                            uid: order['uid'],
                            partner_id: client.id
                        },
                        action: 'set_client',
                        bus_id: this.pos.config.bus_id[0],
                        order_uid: order['uid']
                    });
                } else {
                    this.pos.pos_bus.push_message_to_other_sessions({
                        data: {
                            uid: order['uid'],
                            partner_id: null
                        },
                        action: 'set_client',
                        bus_id: this.pos.config.bus_id[0],
                        order_uid: order['uid']
                    });
                }

            }
            return res;
        },
        set_pricelist: function (pricelist) {
            var res = _super_order.set_pricelist.apply(this, arguments);
            if ((this.syncing != true || !this.syncing) && this.pos.pos_bus && this.pos.config.bus_id && this.pos.config.bus_id[0] && this.pos.the_first_load == false) {
                var order = this.export_as_JSON();
                if (!order['uid']) {
                    return;
                }
                this.pos.pos_bus.push_message_to_other_sessions({
                    data: {
                        uid: order['uid'],
                        pricelist: pricelist
                    },
                    action: 'change_pricelist',
                    bus_id: this.pos.config.bus_id[0],
                    order_uid: order['uid']
                });
            }
            return res
        },
        init_from_JSON: function (json) {
            _super_order.init_from_JSON.apply(this, arguments);
            this.uid = json.uid;
            this.session_info = json.session_info;
            this.created_time = json.created_time;
        },
        export_as_JSON: function () {
            var json = _super_order.export_as_JSON.apply(this, arguments);
            json.session_info = this.session_info;
            json.uid = this.uid;
            json.temporary = this.temporary;
            json.created_time = this.created_time;
            return json;
        }
    });

    // Model: Orderline
    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function (attr, options) {
            var res = _super_order_line.initialize.apply(this, arguments);
            if (!this.session_info) {
                this.session_info = this.pos.session_info();
            }
            if (!this.uid) {
                var uid = this.order.uid + '-' + this.id;
                this.uid = uid;
            }
            this.order_uid = this.order.uid;
            var self = this;
            this.bind('update:OrderLine', function () {
                self.trigger_update_line();
            });
            if (this.pos.pos_bus) {
                this.bind('remove', function () {
                    if ((this.syncing == false || !this.syncing) && self.pos.config.bus_id[0]) {
                        var order = self.order.export_as_JSON();
                        self.pos.pos_bus.push_message_to_other_sessions({
                            action: 'line_removing',
                            data: {
                                uid: self.uid,
                            },
                            bus_id: this.pos.config.bus_id[0],
                            order_uid: order['uid']
                        });
                    }
                })
            }
            return res;
        },
        init_from_JSON: function (json) {
            if (json['pack_lot_ids']) {
                json.pack_lot_ids = [];
            }
            var res = _super_order_line.init_from_JSON.apply(this, arguments);
            this.uid = json.uid;
            this.session_info = json.session_info;
            return res;
        },
        export_as_JSON: function () {
            var json = _super_order_line.export_as_JSON.apply(this, arguments);
            json.uid = this.uid;
            json.session_info = this.session_info;
            json.order_uid = this.order.uid;
            return json;
        },
        set_quantity: function (quantity, keep_price) {
            var res = _super_order_line.set_quantity.apply(this, arguments);
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false)) {
                if (quantity != "remove") {
                    this.trigger_update_line();
                }
            }
            return res
        },
        set_discount: function (discount) {
            var res = _super_order_line.set_discount.apply(this, arguments);
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false)) {
                this.trigger_update_line();
            }
            return res
        },
        set_unit_price: function (price) {
            var res = _super_order_line.set_unit_price.apply(this, arguments);
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false)) {
                this.trigger_update_line();
            }
            return res
        },
        trigger_update_line: function () {
            var line = this.export_as_JSON();
            if ((!this.syncing || this.syncing == false) && (this.order.syncing == false || !this.order.syncing) && (this.uid && this.order.temporary == false) && this.pos.config.bus_id[0]) {
                var order = this.order.export_as_JSON();
                this.pos.pos_bus.push_message_to_other_sessions({
                    action: 'trigger_update_line',
                    data: {
                        uid: line.uid,
                        line: line,
                    },
                    bus_id: this.pos.config.bus_id[0],
                    order_uid: order['uid']
                });
            }
        }
    });

    return exports;
});
