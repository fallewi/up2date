# -*- coding: utf-8 -*-
{
    'name': "POS Error auto reload",
    'version': '2.1',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'sequence': 0,
    'summary': 'POS Error Auto Reload',
    'description': """
    In POS, if any code-related error occures \n
    This module will make a trigger to auto-reload the page \n
    """,
    'depends': ['point_of_sale'],
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
