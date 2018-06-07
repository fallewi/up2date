# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Package Product Restaurant",
    'summary' : "POS Package Product for retaurant.",
    "version" : "1.0",
    "description": """
        Adding function to have package product for restaurant.
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['pos_restaurant', 'fal_pos_package_product'],
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