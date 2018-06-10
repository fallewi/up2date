odoo.define('fal_pos_show_name.multiprint', function (require) {
"use strict";

var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var mixins = require('web.mixins');
var Session = require('web.Session');

var QWeb = core.qweb;


var _super_order = models.Order.prototype;
models.Order = models.Order.extend({
    computeChanges: function(categories){
        var changes = _super_order.computeChanges.apply(this, arguments)
        if (changes){
            changes['person_name'] = " [" + "No Name" + "]"
            if (this.changed){
                if (this.changed.client){
                    if(this.changed.client.name){
                        changes['person_name'] = " [" + this.changed.client.name + "]"
                    }
                }
            }
        }
        return changes
    },
});

});
