# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import UserError, ValidationError
from odoo.addons import decimal_precision as dp


class SchemeProgram(models.Model):
    _name = 'fal.pos.promotional.scheme'

    name = fields.Char("Name", required=True)
    scheme_type = fields.Selection(
                        [('product', 'Product')], required=True)
    product_id = fields.Many2one('product.product', string="Product", domain="[('is_promotional_item', '=', 1)]")
    product_uom_qty = fields.Float(string='Quantity', digits=dp.get_precision('Product Unit of Measure'), default=1.0)
    active = fields.Boolean('Active', default=True)
    repeatable = fields.Boolean("Repeatable")
    rule_ids = fields.One2many('fal.pos.promotional.scheme.rule', 'scheme_id', string="Rule(s)", required=True)

    @api.model
    def rule_satisfied(self, vals):
        if not vals:
            return False
        scheme = self.browse(vals['scheme_id'])
        if scheme.repeatable:
            possible = True
            qty = 0
            while possible:
                for rule in scheme.rule_ids:
                    if rule.rule_type == 'total_sale':
                        vals['total_sale'] -= rule.sale_total
                        if vals['total_sale'] > 0:
                            qty += scheme.product_uom_qty
                        else:
                            possible = False
            return qty
        else:
            for rule in scheme.rule_ids:
                if rule.rule_type == 'total_sale':
                    vals['total_sale'] -= rule.sale_total
                    if vals['total_sale'] > 0:
                        return scheme.product_uom_qty
        return False


class SchemeProgramRule(models.Model):
    _name = 'fal.pos.promotional.scheme.rule'

    scheme_id = fields.Many2one('fal.pos.promotional.scheme', 'Scheme')
    rule_type = fields.Selection(
                        [('total_sale', 'Total Sale')], required=True)
    currency_id = fields.Many2one("res.currency", default=lambda self: self.env.user.company_id.currency_id, string="Currency")
    sale_total = fields.Monetary(string='Total')

    _sql_constraints = [
        ('check_sale_total', "CHECK (rule_type = 'total_sale' and sale_total > 0 or rule_type != 'total_sale')", "Total sale rule's total value cannot be 0")
    ]
