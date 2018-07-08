# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Discount Restrcition",
    'summary' : "POS Discount Restriction.",
    "version" : "1.0",
    "description": """
        This module is to block discount for normal POS user.
        """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['pos_restaurant', 'pos_discount'],
    "data" : [
        'template/import.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: