import logging
from datetime import timedelta
from functools import partial

import psycopg2
import pytz

from odoo import api, fields, models, tools, _
from odoo.tools import float_is_zero
from odoo.exceptions import UserError
from odoo.http import request
from odoo.addons import decimal_precision as dp

_logger = logging.getLogger(__name__)


class PosOrderLine(models.Model):
    _inherit = "pos.order.line"

    fal_addons_product_ids = fields.Many2many('product.template', string="Addons Product")

class PosOrder(models.Model):
    _inherit = "pos.order"

    @api.model
    def create_from_ui(self, orders):

        order_ids = super(PosOrder, self).create_from_ui(orders)
        obj_order_ids = self.browse(order_ids)

        for order_id in obj_order_ids:
            for order in orders:
                if order_id.pos_reference == order['data']['name']:
                    for data in order_id.lines:
                        for order_line in order['data']['lines']:
                            if data.name == order_line[2]['name']:
                                product_ids = self.env['product.product'].browse(order_line[2]['addons_products'])
                                product_template_ids = []
                                for product_id in product_ids:
                                    product_template_ids.append(product_id.product_tmpl_id.id)
                                data.write({
                                    'fal_addons_product_ids': [(6, 0, product_template_ids)],
                                    })

        return order_ids
