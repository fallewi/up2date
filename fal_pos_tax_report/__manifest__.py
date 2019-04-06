# -*- coding: utf-8 -*-
{
    'name': "POS Max Sell",
    'version': '1.0',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'sequence': 0,
    'summary': 'POS Max Sell',
    'description': """
    In POS, we want to be able to give warning after POS reaching.\n
    the desired sell limit.
    """,
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_config_views.xml',
        'security/ir.model.access.csv',
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
