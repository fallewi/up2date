# -*- coding: utf-8 -*-
from odoo import fields, models


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    pos_sold_out = fields.Boolean("POS Sold Out", default="0", help="Sold out (Not based on Stock)")

# end of ProductTemplate()
