# -*- coding: utf-8 -*-

{
    "name" : "Falinwa POS Show Name",
    'summary' : "POS Pay Show Name.",
    "version" : "1.0",
    "description": """
        This Module is used to show name on kitchen order and cashier print.""",
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