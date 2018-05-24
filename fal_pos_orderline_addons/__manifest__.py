# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS OrderLine Addons",
    'summary' : "POS Orderline Addons.",
    "version" : "1.0",
    "description": """
        Adding function to add topping / addons on the orderlines / product on POS.
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['point_of_sale'],
    "data" : [
        'template/import.xml',
        'views/product_views.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: