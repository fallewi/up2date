# -*- coding: utf-8 -*-
{
    'name': "POS Sold Out List",
    'version': '1.0',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'sequence': 0,
    'summary': 'POS Sold Out List',
    'description': """
    In POS, we want to be able to say that an item is sold out.\n
    Thus blocking the order of that item.
    """,
    'depends': ['point_of_sale'],
    'data': [
        'views/product_view.xml',
        'template/__import__.xml',
    ],
    'demo': [],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'website': 'http://falinwa.com',
    'images': ['static/description/icon.png'],
    'support': 'randy.raharjo@falinwa.com'
}
