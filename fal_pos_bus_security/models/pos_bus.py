# -*- coding: utf-8 -*-
from odoo import api, models, fields, registry
import json
import base64

class pos_bus(models.Model):
    _inherit = "pos.bus"

    @api.multi
    def _clean_stuck_data(self):
        for pos_bus in self:
            for pos_bus_log in pos_bus.log_ids.filtered(lambda r: r.state == 'still' and r.action != 'new_order'):
                if not self.env['pos.bus.log'].search([('state', '=', 'still'), ('action', '=', 'new_order'), ('order_uid', '=', pos_bus_log.order_uid), ('bus_id', '=', pos_bus.id)]):
                    pos_bus_log.update({'state': 'done', 'faulty': True})

class pos_bus_log(models.Model):
    _inherit = "pos.bus.log"

    faulty = fields.Boolean("Faulty Data")
    big_order = fields.Boolean("Big Order")
    # log_history_count = fields.Integer("Log History Count")

    # Not sure this still needed after JS delete addons.
    # I am afraid of conflict after
    # @api.model
    # def create(self, vals):
    #     res = super(pos_bus_log, self).create(vals)
    #     if res.bus_id and res.order_uid:
    #         search_res = self.search([('state', '=', 'still'), ('order_uid', '=', res.order_uid), ('bus_id', '=', res.bus_id.id)])
    #         # If order line exceed 250, auto delete the logs
    #         if len(search_res) > 250:
    #             search_res.write({'state': 'done', 'big_order': True})
    #         head_order = self.search([('action', '=', 'new_order'), ('order_uid', '=', res.order_uid), ('bus_id', '=', res.bus_id.id)])
    #         # If head order is faulty / in done = Mark as faulty
    #         # If head order is in big data = Mark as Big Order
    #         if head_order:
    #             if head_order.faulty or head_order.state == 'done':
    #                 res.write({'state': 'done', 'faulty': True})
    #             elif head_order.big_order:
    #                 res.write({'state': 'done', 'big_order': True})
    #     return res

    # Not sure how to play with it yet
    # @api.model
    # def api_get_data(self, bus_id, user_id):
    #     datas = self.search([
    #         ('bus_id', '=', bus_id),
    #         ('state', '=', 'still')
    #     ])
    #     values = []
    #     for data in datas:
    #         values.append(json.loads(base64.decodestring(data.log).decode('utf-8')))
    #         if values[0] and values[0]['value'] and values[0]['value']['action'] == 'new_order' and values[0]['value']['data']:
    #             # values[0]['log_history_count'] = data.log_history_count
    #             values[0]['value']['data']['log_history_count'] = 10
    #     return values
