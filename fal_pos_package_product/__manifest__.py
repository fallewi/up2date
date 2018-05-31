# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Package Product",
    'summary' : "POS Package Product.",
    "version" : "1.0",
    "description": """
        Adding function to have package product.
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['point_of_sale'],
    "data" : [
        'template/import.xml',
        'security/ir.model.access.csv',
        'views/product_views.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: