# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Restaurant OrderLine Addons",
    'summary' : "POS Restaurant Orderline Addons.",
    "version" : "1.0",
    "description": """
        Adding function to add topping / addons on the orderlines / product on POS Restuarant.\n
        Main point is on the bill receipt
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['pos_restaurant', 'fal_pos_orderline_addons'],
    "data" : [
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: