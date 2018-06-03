# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Kicthen Copy & Checker Concept",
    'summary' : "POS Kitchen copy & checker concept.",
    "version" : "1.0",
    "description": """
        As odoo POS sometimes use thermal paper, of course we cannot have copy paper for checking purpose\n.
        This module helps by automatically print the copy paper of kitchen order.\n

        Also sometimes restaurant want to put the order checker on table, so give an option on kitchen printer for double print & checker printer.
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['pos_restaurant'],
    "data" : [
        'template/import.xml',
        'views/pos_restaurant_views.xml'
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: