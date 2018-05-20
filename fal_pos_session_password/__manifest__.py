# -*- coding: utf-8 -*-
{
    'name': "POS Session Password",
    'version': '2.1',
    'category': 'Point of Sale',
    'author': 'Falinwa Limited',
    'sequence': 0,
    'summary': 'POS Session Password',
    'description': """
    In Session, give option to put password \n
    Will be used as base on other apps \n
    """,
    'depends': ['point_of_sale'],
    'data': [
        'views/pos_view.xml'
    ],
    'demo': [],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'website': 'http://falinwa.com',
    'images': ['static/description/icon.png'],
    'support': 'randy.raharjo@falinwa.com'
}
