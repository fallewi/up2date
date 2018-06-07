odoo.define('fal_pos_restaurant_orderline_addons.multiprint', function (require) {
"use strict";

var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var mixins = require('web.mixins');
var Session = require('web.Session');

var QWeb = core.qweb;


var _super_order = models.Order.prototype;
models.Order = models.Order.extend({
    build_line_resume: function(){
        var resume = _super_order.build_line_resume.apply(this, arguments)
        this.orderlines.each(function(line){
            if (line.mp_skip) {
                return;
            }
            var line_hash = line.get_line_diff_hash();
            var addons = line.get_addons_product_array();
            resume[line_hash]['addons'] = addons;
        });
        return resume;
    },
    // Can't really super this one
    // Result is an array that doesn't have relation with current res object.
    // That's why we cannot just add the addons into the result object.
    computeChanges: function(categories){
        var current_res = this.build_line_resume();
        var old_res     = this.saved_resume || {};
        var json        = this.export_as_JSON();
        var add = [];
        var rem = [];
        var line_hash;

        for ( line_hash in current_res) {
            var curr = current_res[line_hash];
            var old  = old_res[line_hash];

            if (typeof old === 'undefined') {
                add.push({
                    'id':       curr.product_id,
                    'name':     this.pos.db.get_product_by_id(curr.product_id).display_name,
                    'name_wrapped': curr.product_name_wrapped,
                    'note':     curr.note,
                    'addons':   curr.addons,
                    'qty':      curr.qty,
                });
            } else if (old.qty < curr.qty) {
                add.push({
                    'id':       curr.product_id,
                    'name':     this.pos.db.get_product_by_id(curr.product_id).display_name,
                    'name_wrapped': curr.product_name_wrapped,
                    'note':     curr.note,
                    'addons':   curr.addons,
                    'qty':      curr.qty - old.qty,
                });
            } else if (old.qty > curr.qty) {
                rem.push({
                    'id':       curr.product_id,
                    'name':     this.pos.db.get_product_by_id(curr.product_id).display_name,
                    'name_wrapped': curr.product_name_wrapped,
                    'note':     curr.note,
                    'addons':   curr.addons,
                    'qty':      old.qty - curr.qty,
                });
            }
        }

        for (line_hash in old_res) {
            if (typeof current_res[line_hash] === 'undefined') {
                var old = old_res[line_hash];
                rem.push({
                    'id':       old.product_id,
                    'name':     this.pos.db.get_product_by_id(old.product_id).display_name,
                    'name_wrapped': old.product_name_wrapped,
                    'note':     old.note,
                    'addons':   old.addons,
                    'qty':      old.qty, 
                });
            }
        }

        if(categories && categories.length > 0){
            // filter the added and removed orders to only contains
            // products that belong to one of the categories supplied as a parameter

            var self = this;

            var _add = [];
            var _rem = [];
            
            for(var i = 0; i < add.length; i++){
                if(self.pos.db.is_product_in_category(categories,add[i].id)){
                    _add.push(add[i]);
                }
            }
            add = _add;

            for(var i = 0; i < rem.length; i++){
                if(self.pos.db.is_product_in_category(categories,rem[i].id)){
                    _rem.push(rem[i]);
                }
            }
            rem = _rem;
        }

        var d = new Date();
        var hours   = '' + d.getHours();
            hours   = hours.length < 2 ? ('0' + hours) : hours;
        var minutes = '' + d.getMinutes();
            minutes = minutes.length < 2 ? ('0' + minutes) : minutes;

        return {
            'new': add,
            'cancelled': rem,
            'table': json.table || false,
            'floor': json.floor || false,
            'name': json.name  || 'unknown order',
            'time': {
                'hours':   hours,
                'minutes': minutes,
            },
        };
        
    },
});

});
