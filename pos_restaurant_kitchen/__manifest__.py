{
    'name': 'POS Kitchen Screen',
    'sequence': 0,
    'version': '2.6.2',
    'author': 'TL Technology',
    'description': 'Kitchen screen for kitchen/bar room can handle products need processing \n'
                   'And kitchen/bar room can updating status of order lines \n'
                   'When state of order lines change, will display and notify to waiters \n'
                   'Waiter can bring products to customers',
    'category': 'Point of Sale',
    'depends': ['pos_bus_restaurant'],
    'price': '100',
    'website': 'http://posodoo.com',
    "currency": 'EUR',
    'images': ['static/description/icon.png'],
    'support': 'thanhchatvn@gmail.com',
    "external_dependencies": {"python": ['twilio'], "bin": []},
    'installable': True,
    'application': True,
    "license": "OPL-1"
}
