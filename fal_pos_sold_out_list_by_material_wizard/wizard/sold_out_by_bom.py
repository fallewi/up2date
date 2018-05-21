# -*- coding: utf-8 -*-

from odoo import api, fields, models


class SoldOutByBOM(models.TransientModel):
    _name = "sold.out.bom"

    product_ids = fields.Many2many('product.product', string='Empty Material', required=True)

    def sold_out_confirm(self):
        for product in self.product_ids:
            for bom_line in self.env['mrp.bom.line'].search([('product_id', '=', product.id)]):
                bom_line.bom_id.product_tmpl_id.pos_sold_out = True