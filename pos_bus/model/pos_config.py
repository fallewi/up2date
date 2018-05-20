# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class pos_config(models.Model):

    _inherit = "pos.config"

    sync_multi_session = fields.Boolean('Sync multi session', default=1)
    bus_id = fields.Many2one('pos.bus', string='Shop/bus location')
    user_ids = fields.Many2many('res.users', string='Assigned users')
    display_person_add_line = fields.Boolean('Display information line', default=1,
                                             help="When you checked, on pos order lines screen, will display information person created order (lines) Eg: create date, updated date ..")
