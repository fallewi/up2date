// odoo.define('fal_pos_restaurant_package_product.multiprint', function (require) {
// "use strict";

// var models = require('point_of_sale.models');
// var screens = require('point_of_sale.screens');
// var core = require('web.core');
// var mixins = require('web.mixins');
// var Session = require('web.Session');

// var QWeb = core.qweb;


// var _super_order = models.Order.prototype;
// models.Order = models.Order.extend({
//     build_line_resume: function(){
//         var resume = _super_order.build_line_resume.apply(this, arguments)
//         this.orderlines.each(function(line){
//             if (line.mp_skip) {
//                 return;
//             }
//             var line_hash = line.get_line_diff_hash();
//             var pack = line.get_product().package_item_ids_string;
//             resume[line_hash]['package'] = pack;
//         });
//         return resume;
//     },
//     computeChanges: function(categories){
//         var changes = _super_order.build_line_resume.apply(this, arguments)
//         for (var i = 0; changes['new'].length; i++){
//             console.log(this)
//         }
//         return changes
//     },
// });

// });
