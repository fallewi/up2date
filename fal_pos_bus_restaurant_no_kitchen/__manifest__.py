# -*- coding: utf-8 -*-
{
    'name': "POS Restaurant/Cafe Sync Without Kitchen Function",
    'version': '1',
    'category': 'Point of Sale',
    'author': 'Falinwa Indonesia',
    'website': 'http://falinwa.com',
    'sequence': 0,
    'description': "We don't want the kitchen function at the POS restaurant Module",
    'depends': ['pos_bus_restaurant'],
    'data': [
        'import/template.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'demo': [],
    'application': True,
    'images': ['static/description/icon.png'],
    'support': 'randy.raharjo@falinwa.com',
}
