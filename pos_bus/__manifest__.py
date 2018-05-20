# -*- coding: utf-8 -*-
{
    'name': "POS Sync Sessions",
    'version': '2.6.3',
    'category': 'Point of Sale',
    'author': 'TL Technology',
    'sequence': 0,
    'summary': 'POS Sync Sessions',
    'description': """
    If your shop have multi client use pos screen \n
    And you need sync between devices, the same pos orders screens (eg: add new products, change qty, price ...) \n
    And after sync, all screen the same. Module can help you do.
    ....
    """,
    'depends': ['point_of_sale'],
    'data': [
        'security/ir.model.access.csv',
        'template/import.xml',
        'views/pos_bus.xml',
        'views/pos_config.xml',
    ],
    'demo': ['demo/demo.xml'],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'price': '200',
    'website': 'http://posodoo.com',
    "currency": 'EUR',
    'application': True,
    'images': ['static/description/icon.png'],
    'support': 'thanhchatvn@gmail.com',
    "license": "OPL-1"
}
