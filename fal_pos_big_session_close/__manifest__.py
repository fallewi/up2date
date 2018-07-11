# -*- coding: utf-8 -*-
{
    'name': "POS Big Session Close",
    'version': '1.0',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'sequence': 0,
    'summary': 'POS Big Session Close',
    'description': """
    In POS, old session will have thousand of order which can cause problem on session close.\n
    This module help by splitting the confirmation into small part each time.
    """,
    'depends': ['point_of_sale'],
    'data': [
    ],
    'demo': [],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'website': 'http://falinwa.com',
    'images': ['static/description/icon.png'],
    'support': 'randy.raharjo@falinwa.com'
}
