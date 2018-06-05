# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS BUS OrderLine Addons",
    'summary' : "POS Orderline Addons With synchronization.",
    "version" : "1.0",
    "description": """
        Adding function to add topping / addons on the orderlines / product on POS with synchronization.
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['fal_pos_orderline_addons', 'pos_bus'],
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