# -*- coding: utf-8 -*-
from odoo import fields, models


class PosSession(models.Model):
    _inherit = 'pos.session'

    session_password = fields.Char("Session Password", default="1234", required=True)

# end of PosSession()
