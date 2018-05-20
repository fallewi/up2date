odoo.define('client_send_notify_falinwa', function (require) {
    var models = require('point_of_sale.models');
    var core = require('web.core');
    var _t = core._t;

    var _super_order_line = models.Orderline.prototype;
    models.Orderline = models.Orderline.extend({
        assert_user: function() {
            if (this.session_info){
                // If screen are kitchen don't check at all
                if (this.pos.config.screen_type != 'kitchen'){
                    if (this.pos.user.id != this.order.owner_user_id){
                        this.pos.gui.show_popup('error', {
                            'title': _t('Restriction'),
                            'body':  _t('Cannot change other waiters orders.'),
                        });
                        return false
                    }
                }
            };
            return true
        },
        set_quantity: function (quantity, keep_price) {
            if (this.assert_user()){
                var res = _super_order_line.set_quantity.apply(this, arguments);
                return res
            };
            return false
        },
        set_discount: function (discount) {
            if (this.assert_user()){
                var res = _super_order_line.set_discount.apply(this, arguments);
                return res
            };
            return false
        },
        set_unit_price: function (price) {
            if (this.assert_user()){
                var res = _super_order_line.set_unit_price.apply(this, arguments);
                return res
            };
            return false
        },
    });

    var _super_order = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function (attributes, options) {
            var self = this;
            var res = _super_order.initialize.apply(this, arguments);
            if (!this.owner_user_id){
                this.owner_user_id = options.pos.user.id;
            }
            this.log_history = 0;
            if (this.orderlines.length == 0){
                this.last_empty_time = new Date();
            }else{
                this.last_empty_time = false;
            }
            setInterval(function () {
                self.check_idle_empty_order();
            }, 10000);
            return res;
        },
        check_idle_empty_order: function () {
            if (this.last_empty_time){
                if ((new Date() - this.last_empty_time)/1000 > 600){
                    var order = this;
                    if (order && order.orderlines.length == 0) {
                        var posModel = this.pos
                        order.destroy({'reason':'abandon'});
                        order.last_empty_time = false
                        if (posModel.floors.length) {
                            posModel.trigger('update:floor-screen');
                        }
                    }else if (order && order.orderlines.length > 0 && order.last_empty_time){
                        order.last_empty_time = false
                    }
                }
            }
        },
        generate_unique_id: function() {
            // Generates a public identification number for the order.
            // The generated number must be unique and sequential. They are made 12 digit long
            // to fit into EAN-13 barcodes, should it be needed

            // Falinwa Update, because of sync, I think it's a bit dangerous just to believe on sequence number
            // So I added number value just to be safe

            function zero_pad(num,size){
                var s = ""+num;
                while (s.length < size) {
                    s = "0" + s;
                }
                return s;
            }

            var n = Math.floor((Math.random() * 100) + 1);

            return zero_pad(this.pos.pos_session.id,3) +'-'+
                   zero_pad(this.pos.pos_session.login_number,3) +'-'+
                   zero_pad(this.sequence_number,4) +
                   zero_pad(n,2);
        },
        set_owner: function (owner) {
            this.owner_user_id = owner;
            if ((!this.syncing || this.syncing == false) && this.pos.pos_bus) {
                if (owner) {
                    var order = this.export_as_JSON();
                    this.pos.pos_bus.push_message_to_other_sessions({
                        data: {
                            uid: this.uid,
                            owner_user_id: owner,
                        },
                        action: 'set_owner',
                        bus_id: this.pos.config.bus_id[0],
                        order_uid: order['uid'],
                    });
                }
            }
        },
        export_as_JSON: function() {
            var json = _super_order.export_as_JSON.apply(this, arguments);
            if (this.owner_user_id) {
                json.owner_user_id = this.owner_user_id;
            }
            return json;
        },
        init_from_JSON: function(json) {
            _super_order.init_from_JSON.apply(this, arguments);
            this.owner_user_id = json.owner_user_id;
        },
        add_product: function(product, options){
            // Not sure why, But cannot do it via super
            // So for now let it be like this
            if(this.pos.user.id != this.owner_user_id){
                this.pos.gui.show_popup('error', {
                        'title': _t('Restriction'),
                        'body':  _t('Cannot change other waiters orders.'),
                    });
            }else{
                if(this.orderlines.length > 49){
                    this.pos.gui.show_popup('error', {
                        'title': _t('Restriction'),
                        'body':  _t('Orderlines cannot exceed 50.'),
                    });
                }else{
                    if(this._printed){
                        this.destroy();
                        return this.pos.get_order().add_product(product, options);
                    }
                    this.assert_editable();
                    options = options || {};
                    var attr = JSON.parse(JSON.stringify(product));
                    attr.pos = this.pos;
                    attr.order = this;
                    var line = new models.Orderline({}, {pos: this.pos, order: this, product: product});

                    if(options.quantity !== undefined){
                        line.set_quantity(options.quantity);
                    }

                    if(options.price !== undefined){
                        line.set_unit_price(options.price);
                    }

                    //To substract from the unit price the included taxes mapped by the fiscal position
                    this.fix_tax_included_price(line);

                    if(options.discount !== undefined){
                        line.set_discount(options.discount);
                    }

                    if(options.extras !== undefined){
                        for (var prop in options.extras) {
                            line[prop] = options.extras[prop];
                        }
                    }

                    var to_merge_orderline;
                    for (var i = 0; i < this.orderlines.length; i++) {
                        if(this.orderlines.at(i).can_be_merged_with(line) && options.merge !== false){
                            to_merge_orderline = this.orderlines.at(i);
                        }
                    }
                    if (to_merge_orderline){
                        to_merge_orderline.merge(line);
                    } else {
                        this.orderlines.add(line);
                    }
                    this.select_orderline(this.get_last_orderline());

                    if(line.has_product_lot){
                        this.display_lot_popup();
                    }
                }
            }
        },
    });
})
