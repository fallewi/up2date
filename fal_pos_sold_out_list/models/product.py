# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    pos_sold_out = fields.Boolean("POS Sold Out", default=False, help="Sold out (Not based on Stock)")

    @api.multi
    def sold_out(self):
        for product in self:
            product.pos_sold_out = True

    @api.multi
    def unsold_out(self):
        for product in self:
            product.pos_sold_out = False
# end of ProductTemplate()
