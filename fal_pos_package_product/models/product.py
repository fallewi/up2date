# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from odoo.addons import decimal_precision as dp

class ProductTemplate(models.Model):
    _inherit = 'product.template'

    package_item_ids = fields.One2many("product.package.item", "parent_product_id", string="Package Item")
    # To make life simpler, let's make the string generator here
    # Later if we have time, move it to JS function
    package_item_ids_string = fields.Char("Package Item in string", compute="get_package_item_in_string")

    @api.multi
    @api.depends('package_item_ids')
    def get_package_item_in_string(self):
        for product in self:
            res = ""
            for package_item in product.package_item_ids:
                item_qty = package_item.qty and str(int(package_item.qty)) or ""
                product_name = package_item.product_id and package_item.product_id.display_name or ""
                res += item_qty + " x " + product_name + ", "
            res = res[:-2]
            product.package_item_ids_string = res


class ProductPackageItem(models.Model):
    _name = 'product.package.item'

    parent_product_id = fields.Many2one("product.template", "Parent Product")
    product_id = fields.Many2one("product.template", "Product")
    qty = fields.Float("Quantity", digits=dp.get_precision('Product Unit of Measure'))

# end of ProductTemplate()
