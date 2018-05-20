odoo.define('pos_restaurant_kitchen.pos_model', function (require) {

    var models = require('point_of_sale.models');

    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({

        play_sound: function() {
            if (this.config.play_sound == true) {
                var src = "/pos_restaurant_kitchen/static/src/sounds/demonstrative.mp3";
                $('body').append('<audio src="'+src+'" autoplay="true"></audio>');
            }
        },
        syncing_sessions: function (message) {
            var res = _super_posmodel.syncing_sessions.apply(this, arguments);
            if (message['action'] == 'set_state') {
                this.sync_state(message['data']);
            }
            if (this.config.screen_type == 'kitchen') {
                this.trigger('update:kitchenscreen');
            }
            return res;
        },
        sync_state: function(vals) {
            var line = this.get_line_by_uid(vals['uid']);
            if (line) {
                line.syncing = true;
                line.set_state(vals['state']);
                this.play_sound();
                line.syncing = false;
            }
        }
    });
    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function (attributes, options) {
            var self = this;
            _super_order.initialize.apply(this, arguments);
            if (!this.notify_messages) {
                this.notify_messages = {};
            }
            this.state = false;
        },
        saveChanges: function () {
            var orderlines = this.orderlines.models;
            for (var i = 0; i < orderlines.length; i++) {
                if (orderlines[i].state && orderlines[i].state == 'Need-to-confirm') {
                    orderlines[i].set_state('Confirmed');
                }
            }
            _super_order.saveChanges.apply(this, arguments);
        },
        export_as_JSON: function () {
            var json = _super_order.export_as_JSON.apply(this, arguments);
            if (this.notify_messages) {
                json.notify_messages = this.notify_messages;
            }
            return json;
        },
    });
    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        initialize: function () {
            _super_order_line.initialize.apply(this, arguments);
            if (!this.state) {
                this.state = 'Need-to-confirm';
            }
            this.cancel_reason = '';
            this.creation_time = new Date().toLocaleTimeString();
        },
        init_from_JSON: function (json) {
            if (json.state) {
                this.state = json.state;
            }
            if (json.creation_time) {
                this.creation_time = json.creation_time;
            }
            _super_order_line.init_from_JSON.apply(this, arguments);
        },
        set_quantity: function (quantity) {
            if (this.state == 'Waiting-delivery') {
                if (quantity != this.quantity) {
                    this.quantity_updated = this.quantity;
                    if (quantity > this.quantity) {
                        this.state = 'Confirmed';
                    }
                }
            }
            _super_order_line.set_quantity.apply(this, arguments);
        },
        set_state: function (state) {
            this.state = state;
            this.trigger('change', this);
            if (!this.syncing || this.syncing == false) {
                this.pos.pos_bus.push_message_to_other_sessions({
                    action: 'set_state',
                    data: {
                        uid: this.uid,
                        state: state,
                    },
                    order: this.export_as_JSON(),
                    bus_id: this.pos.config.bus_id[0],
                });
                this.pos.trigger('update:kitchenscreen');
            }
            if (state == 'Cancel') {
                this.set_quantity('remove');
            }

        },
        export_as_JSON: function () {
            var json = _super_order_line.export_as_JSON.apply(this, arguments);
            if (this.state) {
                json.state = this.state;
            }
            if (this.cancel_reason) {
                json.cancel_reason = this.cancel_reason;
            }
            if (this.quantity_updated) {
                json.quantity_updated = this.quantity_updated;
            }
            if (this.creation_time) {
                json.creation_time = this.creation_time;
            }
            return json;
        },
        product_url: function(product_id) {
            return window.location.origin + '/web/image?model=product.product&field=image_medium&id=' + product_id;
        }
    });
});
