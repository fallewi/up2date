odoo.define('fal_pos_max_sell.models', function (require) {
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');

    var _super_posmodel = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        initialize: function(session, attributes) {
            res = _super_posmodel.initialize.call(this,session,attributes);
            var self = this;
            setInterval(function () {
                self.load_max_sell();
            }, 10000);
            return res;
        },

        // Check max sell
        load_max_sell: function(){
            var self = this;
            var def  = new $.Deferred();
            if (self.pos_session){
                rpc.query({
                        model: 'pos.config',
                        method: 'limit_reached',
                        args: [self.pos_session.config_id[0]],
                    }, {
                        timeout: 3000,
                        shadow: true,
                    })
                    .then(function(max_sell){
                        if (max_sell){
                            $('.js_maxsell').removeClass('icon-green')
                            $('.js_maxsell').addClass('icon-red')
                        }else{
                            $('.js_maxsell').removeClass('icon-red')
                            $('.js_maxsell').addClass('icon-green')
                        }
                        def.resolve();
                    }, function(type,err){ def.reject(); });
                return def;
            }
            return false
        },
    });

});
