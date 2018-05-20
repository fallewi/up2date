# -*- coding: utf-8 -*-
from odoo import api, fields, models, _

class pos_config(models.Model):

    _inherit = "pos.config"

    bus_master = fields.Boolean("Bus Master")
