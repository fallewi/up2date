# -*- coding: utf-8 -*-
{
    'name': "POS Sold Out List by Material Wizard",
    'version': '1.0',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'sequence': 0,
    'summary': 'POS Sold Out List by Material Wizard',
    'description': """
    Faster to select product that is sold out, using BOM as the base source.
    """,
    'depends': ['fal_pos_sold_out_list', 'mrp'],
    'data': [
        'wizard/sold_out_by_bom_views.xml',
    ],
    'demo': [],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'website': 'http://falinwa.com',
    'images': ['static/description/icon.png'],
    'support': 'randy.raharjo@falinwa.com'
}
