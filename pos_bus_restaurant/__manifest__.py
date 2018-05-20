# -*- coding: utf-8 -*-
{
    'name': "POS Restaurant/Cafe Sync",
    'version': '2.6.2',
    'category': 'Point of Sale',
    'author': 'TL Technology',
    'price': '50',
    'website': 'http://posodoo.com',
    'sequence': 0,
    'description': "At Restaurant we're have multi device (cashiers, waiters, kitchens ) "
                   "and use multi devices, module support sycning all devices at restaurant",
    'depends': ['pos_bus', 'pos_restaurant', 'point_of_sale'],
    'data': [
        'import/template.xml',
        'views/restaurant.xml',
        'views/pos_config.xml',
        'views/product.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'demo': ['demo/demo.xml'],
    "currency": 'EUR',
    'application': True,
    'images': ['static/description/icon.png'],
    'support': 'thanhchatvn@gmail.com',
    "license": "OPL-1"
}
