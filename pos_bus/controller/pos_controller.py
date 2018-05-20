# -*- coding: utf-8 -*
from odoo.http import request
from odoo.addons.bus.controllers.main import BusController
from odoo import api, http, SUPERUSER_ID
import json
import logging
import base64

_logger = logging.getLogger(__name__)

class pos_bus(BusController):
    def _poll(self, dbname, channels, last, options):
        channels = list(channels)
        channels.append((request.db, 'pos.bus', request.uid))
        return super(pos_bus, self)._poll(dbname, channels, last, options)

    @http.route('/pos/sync', type="json", auth="public")
    def send(self, bus_id, messages):
        _logger.info('{sync} starting')
        for message in messages:
            _logger.info('{sync} %s' % message['value']['action'])
            user_send = request.env['res.users'].sudo().browse(message['user_send_id'])
            sessions = request.env['pos.session'].sudo().search([
                ('state', '=', 'opened'),
                ('user_id', '!=', user_send.id)
            ])
            send = 0
            if message['value']['action'] == 'unlink_order':
                request.env['pos.bus.log'].search([
                    ('order_uid', '=', message['value']['order_uid'])
                ]).write({
                    'state': 'done'
                })
                request.env['pos.bus.log'].create({
                    'user_id': message['user_send_id'],
                    'action': message['value']['action'],
                    'order_uid': message['value']['order_uid'],
                    'log': base64.encodestring(json.dumps(message).encode('utf-8')),
                    'bus_id': bus_id,
                    'state': 'done'
                })
            else:
                request.env['pos.bus.log'].create({
                    'user_id': message['user_send_id'],
                    'action': message['value']['action'],
                    'order_uid': message['value']['order_uid'],
                    'log': base64.encodestring(json.dumps(message).encode('utf-8')),
                    'bus_id': bus_id,
                })
            for session in sessions:
                if session.config_id.bus_id and session.config_id.bus_id.id == message['value'][
                    'bus_id'] and user_send.id != session.user_id.id:
                    _logger.info('{0}'.format('{sync} from %s to %s') % (user_send.login, session.user_id.login))
                    send += 1
                    request.env['bus.bus'].sendmany(
                        [[(request.env.cr.dbname, 'pos.bus', session.user_id.id), json.dumps(message)]])
            if send == 0:
                _logger.info('Empty clients online for sync')
        _logger.info('{sync} end')
        return json.dumps({
            'status': 'OK',
            'code': 200
        })