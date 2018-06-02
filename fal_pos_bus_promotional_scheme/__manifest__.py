# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Promotional Scheme with Synchronization",
    'summary' : "POS Promotional Scheme with Synchronization.",
    "version" : "1.0",
    "description": """
        Adding synchronization to promotional scheme module
    """,
    'author' : 'Fal Randy Raharjo.',
    'category' : 'Point of Sale',
    'website' : '',
    "depends" : ['fal_pos_promotional_scheme', 'pos_bus'],
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