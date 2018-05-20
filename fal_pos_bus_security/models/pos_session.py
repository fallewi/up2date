# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, SUPERUSER_ID, _
from odoo.exceptions import UserError, ValidationError


class PosSession(models.Model):
    _inherit = 'pos.session'

    @api.multi
    def action_pos_session_closing_control(self):
        # Falinwa Addons, we check on other session that are belong to the same bus as this config if it's closed or not
        # Then we close all logs related to this session
        if self.config_id.bus_id and self.config_id.bus_master:
            # 1st. Clean all data that is faulty
            # 2nd. Mark still opened pos bus log on this bus as done.
            if self._check_pos_bus_member_session():
                self.config_id.bus_id._clean_stuck_data()
                self.env['pos.bus.log'].search([('state', '=', 'still'), ('bus_id', '=', self.config_id.bus_id.id)]).write({'state': 'done'})
                super(PosSession, self).action_pos_session_closing_control()
            else:
                raise UserError(_('You cannot close master bus session if other bus-related pos session are still not closed.'))
        else:
            super(PosSession, self).action_pos_session_closing_control()

    @api.multi
    def _check_pos_bus_member_session(self):
        for session in self:
            if (session.config_id and session.config_id.bus_id or False) and (session.config_id and session.config_id.bus_master):
                res = self.search([('config_id', 'in', self.env['pos.config'].search([('bus_id', '=', session.config_id.bus_id.id), ('id', '!=', session.config_id.id)]).ids), ('state', '!=', 'closed')])
                if res:
                    return False
            else:
                return True
        return True
