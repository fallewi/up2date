# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Promotional Scheme",
    'summary' : "POS Promotional Scheme.",
    "version" : "1.0",
    "description": """
        It's different with loyalty, where loyalty is linked with the customer. In promotional scheme the rules doesn't really tied with points, but with rules. And it's not tied by customer
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['point_of_sale'],
    "data" : [
        'template/import.xml',
        'security/ir.model.access.csv',
        'views/pos_promotional_scheme_views.xml',
        'views/product_views.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: