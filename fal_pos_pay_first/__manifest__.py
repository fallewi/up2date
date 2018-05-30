# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Pay First",
    'summary' : "POS Pay First.",
    "version" : "1.0",
    "description": """
        This module is designed for restaurant that need to make sure payment is made before \n
        order can be made The feature is\n
        1. Lock (Hide) order button
        2. Change Validate button to Order & Bill & Lock on Adding more item / change payment
        3. After Order Bill Lock button, validate button will come out.""",
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['pos_restaurant'],
    "data" : [
        'template/import.xml',
    ],
    'qweb': [
        'static/src/xml/*.xml'
    ],
    "auto_install": False,
    "installable": True,
}
# vim:expandtab:smartindent:tabstop=4:softtabstop=4:shiftwidth=4: