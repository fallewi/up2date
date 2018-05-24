# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    is_topping_item = fields.Boolean("Topping Item", default=False, help="Topping / Addons Item")
    available_topping_ids = fields.Many2many("product.template", "product_template_product_template_rel", "parent_product_id", "topping_product_id", string="Topping(s)", domain="[('is_topping_item', '=', 1)]")

# end of ProductTemplate()
