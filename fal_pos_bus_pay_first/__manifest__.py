# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Pay First with Synchronization",
    'summary' : "POS Pay First with Synchronization.",
    "version" : "1.0",
    "description": """
        Adding synchronization to pay first module
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['fal_pos_pay_first', 'pos_bus'],
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