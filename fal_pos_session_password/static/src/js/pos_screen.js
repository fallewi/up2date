odoo.define('fal_pos_session_password.pos_screen', function (require) {
"use strict";

var core = require('web.core');
var session = require('web.session');
var models = require('point_of_sale.models');

var _t = core._t;

models.load_models([
    {
        model:  'pos.session',
        fields: ['id', 'journal_ids','name','user_id','config_id','start_at','stop_at','sequence_number','login_number', 'session_password'],
        domain: function(self){ return [['state','=','opened'],['user_id','=',session.uid]]; },
        loaded: function(self,pos_sessions){
            self.pos_session = pos_sessions[0];
        },
    },
],{'after': 'pos.session'});

});
