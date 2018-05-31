odoo.define('fal_pos_package_product.models', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var core = require('web.core');
    var QWeb     = core.qweb;

    var _t = core._t;

    models.load_fields("product.product", "package_item_ids");
    models.load_fields("product.product", "package_item_ids_string");

});
