# -*- coding: utf-8 -*-
from odoo import api, fields, models, SUPERUSER_ID, _
from odoo.exceptions import UserError, ValidationError
from datetime import datetime, timedelta, date


class PosSession(models.Model):
    _inherit = 'pos.session'

    def _confirm_orders(self):
        for session in self:
            oldest_date_order = self.env['pos.order'].search([('session_id', '=', session.id)], order="date_order asc", limit=1)
            newest_date_order = self.env['pos.order'].search([('session_id', '=', session.id)], order="date_order desc", limit=1)
            print (oldest_date_order.date_order)
            print (newest_date_order.date_order)
            oldest_date_order = fields.Datetime.from_string(oldest_date_order.date_order)
            newest_date_order = fields.Datetime.from_string(newest_date_order.date_order)
            days = (newest_date_order - oldest_date_order).days
            for day in range(days+1):
                # Generated Day Range
                generated_start_date = (oldest_date_order + timedelta(days=day)).replace(hour=0, minute=0, second=0)
                generated_end_date = (oldest_date_order + timedelta(days=day)).replace(hour=23, minute=59, second=59)
                print ("Each Day")
                print (generated_start_date)
                print (generated_end_date)
                company_id = session.config_id.journal_id.company_id.id
                orders = session.order_ids.filtered(lambda order: order.state == 'paid' and order.date_order >= fields.Datetime.to_string(generated_start_date) and order.date_order <= fields.Datetime.to_string(generated_end_date))
                journal_id = self.env['ir.config_parameter'].sudo().get_param(
                    'pos.closing.journal_id_%s' % company_id, default=session.config_id.journal_id.id)
                if not journal_id:
                    raise UserError(_("You have to set a Sale Journal for the POS:%s") % (session.config_id.name,))
                move = self.env['pos.order'].with_context(force_company=company_id)._create_account_move(session.start_at, session.name, int(journal_id), company_id)
                orders.with_context(force_company=company_id)._create_account_move_line(session, move)
                for order in session.order_ids.filtered(lambda o: o.state not in ['done', 'invoiced'] and o.date_order >= fields.Datetime.to_string(generated_start_date) and o.date_order <= fields.Datetime.to_string(generated_end_date)):
                    if order.state not in ('paid'):
                        raise UserError(
                            _("You cannot confirm all orders of this session, because they have not the 'paid' status.\n"
                              "{reference} is in state {state}, total amount: {total}, paid: {paid}").format(
                                reference=order.pos_reference or order.name,
                                state=order.state,
                                total=order.amount_total,
                                paid=order.amount_paid,
                            ))
                    order.action_pos_order_done()
                orders = session.order_ids.filtered(lambda order: order.state in ['invoiced', 'done'] and order.date_order >= fields.Datetime.to_string(generated_start_date) and order.date_order <= fields.Datetime.to_string(generated_end_date))
                print ("Day Finish")
                orders.sudo()._reconcile_payments()
