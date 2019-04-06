# -*- coding: utf-8 -*-
from odoo import api, fields, models, _
from datetime import datetime, timedelta
import pytz
from odoo.exceptions import UserError, ValidationError


class pos_config(models.Model):

    _inherit = "pos.config"

    pos_config_sell_limit_ids = fields.One2many("pos.config.sell.limit", 'pos_config_id', "Sale Limit")

    @api.model
    def limit_reached(self, config_id):
        # Get the limit object
        tz = pytz.timezone(self.env.user.tz) if self.env.user.tz else pytz.utc
        now = fields.Datetime.from_string(fields.Datetime.now())
        now = pytz.utc.localize(now)
        now = now.astimezone(tz)
        limit_ids = self.env['pos.config.sell.limit'].search([('pos_config_id', '=', config_id), ('start_time' ,"<=", now.hour), ('end_time' ,">=", now.hour)])
        for sell_limit in limit_ids:
            # Date Start & End
            tz = pytz.timezone(self.env.user.tz) if self.env.user.tz else pytz.utc
            enddate = fields.Datetime.from_string(fields.Datetime.now())
            enddate = tz.localize(enddate)
            enddate = enddate.replace(hour=sell_limit.end_time, minute=0, second=0)
            enddate = enddate.astimezone(pytz.utc)
            string_enddate = fields.Datetime.to_string(enddate)

            startdate = fields.Datetime.from_string(fields.Datetime.now())
            startdate = tz.localize(startdate)  # Add "+hh:mm" timezone
            startdate = startdate.replace(hour=sell_limit.start_time, minute=0, second=0)  # Set 8 AM in localtime
            startdate = startdate.astimezone(pytz.utc)  # Convert to UTC
            string_startdate = fields.Datetime.to_string(startdate)

            # Search corresponding order
            total_sale = sum(order.amount_total for order in self.env['pos.order'].search([('date_order', '>=', string_startdate), ('date_order', '<=', string_enddate), ('config_id', '=', config_id)]))
            if total_sale > sell_limit.max_sell:
                return True
        return False


class pos_config_sell_limit(models.Model):

    _name = "pos.config.sell.limit"

    pos_config_id = fields.Many2one('pos.config', "Config")
    start_time = fields.Selection([(0,'0'),(1, '1'),(2, '2'),(3, '3'),
                                    (4, '4'),(5, '5'),(6, '6'),(7, '7'),
                                    (8, '8'),(9, '9'),(10, '10'),(11, '11'),
                                    (12, '12'),(13, '13'),(14, '14'),(15, '15'),
                                    (16, '16'),(17, '17'),(18, '18'),(19, '19'),
                                    (20, '20'),(21, '21'),(22, '22'),(23, '23'),], "Start", required=True)
    end_time = fields.Selection([(0,'0'),(1, '1'),(2, '2'),(3, '3'),
                                (4, '4'),(5, '5'),(6, '6'),(7, '7'),
                                (8, '8'),(9, '9'),(10, '10'),(11, '11'),
                                (12, '12'),(13, '13'),(14, '14'),(15, '15'),
                                (16, '16'),(17, '17'),(18, '18'),(19, '19'),
                                (20, '20'),(21, '21'),(22, '22'),(23, '23'),], "End", required=True)
    max_sell = fields.Monetary(string='Max Sell', required=True)
    currency_id = fields.Many2one("res.currency", default=lambda self: self.env.user.company_id.currency_id, string="Currency")

    @api.constrains('start_time', 'end_time')
    def _check_dates(self):
        if self.filtered(lambda c: c.end_time and c.start_time > c.end_time):
            raise ValidationError(_('Start Time must be lesser than End Time.'))