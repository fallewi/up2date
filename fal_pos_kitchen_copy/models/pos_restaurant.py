# -*- coding: utf-8 -*-

from odoo import api, fields, models


class RestaurantPrinter(models.Model):

    _inherit = 'restaurant.printer'

    checker_printer = fields.Boolean("Checker Printer")
    double_copy = fields.Boolean("Double Copy")
    