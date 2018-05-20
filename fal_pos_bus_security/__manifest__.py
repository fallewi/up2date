# -*- coding: utf-8 -*-
{
    'name': "POS Sync Security",
    'version': '2.1',
    'category': 'Point of Sale',
    'author': 'Falinwa Limited',
    'sequence': 0,
    'summary': 'POS Sync Security',
    'description': """
    In Sync Session, everyone can edit any order \n
    1. This module restrict editing someone else Orderline \n
    Create a take-over button to force ownership of order \n
    2. Create a password protect on order deletion button \n
    3. Define master POS of the bus. Block master session close if members POS session is not closed. \n
    4. Auto delete order if logs exceed some number \n
    5. Auto delete empty order after 10 mins \n
    6. Block orderlines more than 50 each order.\n
    """,
    'depends': ['pos_bus', 'pos_restaurant_kitchen', 'fal_pos_session_password'],
    'data': [
        'template/__import__.xml',
        'views/pos_config.xml'
    ],
    'demo': [],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    'website': 'http://falinwa.com',
    'images': ['static/description/icon.png'],
    'support': 'randy.raharjo@falinwa.com'
}
