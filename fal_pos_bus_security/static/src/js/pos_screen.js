odoo.define('fal_pos_bus_security.pos_screen', function (require) {
"use strict";

var core = require('web.core');
var screens = require('point_of_sale.screens');
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

var ButtonTakeOrder = screens.ActionButtonWidget.extend({
    template: 'ButtonTakeOrder',
    button_click: function(){
        var self = this;
        this.gui.ask_password(this.pos.pos_session.session_password).then(function(){
            self.pos.get_order().set_owner(self.pos.user.id);
        });
    },
});

screens.define_action_button({
    'name': 'takeorder',
    'widget': ButtonTakeOrder,
    'condition': function(){
        return true;
    },
});


});
