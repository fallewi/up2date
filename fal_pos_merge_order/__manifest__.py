# -*- coding: utf-8 -*-
{
    'name': "POS Merge Order",
    'version': '2.1',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'sequence': 0,
    'summary': 'POS Merge Order',
    'description': """
    In POS, one table can consist of many order, with this \n
    module, we can have the possibility to merge that order \n
    """,
    'depends': ['pos_restaurant'],
    'data': [
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
