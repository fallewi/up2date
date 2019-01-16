# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class ProductTemplate(models.Model):
    _inherit = 'product.template'

    @api.multi
    @api.depends('available_topping_ids')
    def _compute_get_available_topping_product_ids(self):
        for product in self:
            list_product_id = []
            for available_topping_id in product.available_topping_ids:
                for available_topping_product_id in available_topping_id.product_variant_ids:
                    list_product_id.append(available_topping_product_id.id)
            product.available_topping_product_ids = [(6, 0, list_product_id)]

    is_topping_item = fields.Boolean("Topping Item", default=False, help="Topping / Addons Item")
    available_topping_ids = fields.Many2many("product.template", "product_template_product_template_rel", "parent_product_id", "topping_product_id", string="Topping(s)", domain="[('is_topping_item', '=', 1)]")
    available_topping_product_ids = fields.Many2many("product.product", "product_template_product_product_rel", "parent_product_id", "topping_product_id", string="Topping Product(s)", compute='_compute_get_available_topping_product_ids', store=True)

# end of ProductTemplate()
