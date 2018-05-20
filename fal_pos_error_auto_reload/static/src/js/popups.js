odoo.define('fal_pos_error_auto_reload.popups', function (require) {

    var PopupWidget = require('point_of_sale.popups');
    var gui = require('point_of_sale.gui');

    var ErrorTracebackPopupWidget = PopupWidget.extend({
        template:'ErrorTracebackPopupWidget',
        show: function(opts) {
            var self = this;
            opts.title += " --------- Auto Reload in 5 Secs";
            this._super(opts);

            this.$('.download').off('click').click(function(){
                self.gui.prepare_download_link(self.options.body,
                    _t('error') + ' ' + moment().format('YYYY-MM-DD-HH-mm-ss') + '.txt',
                    '.download', '.download_error_file');
            });

            this.$('.email').off('click').click(function(){
                self.gui.send_email( self.pos.company.email,
                    _t('IMPORTANT: Bug Report From Odoo Point Of Sale'),
                    self.options.body);
            });
            setTimeout(function () {
                location.reload();
            }, 5000);
        },
    });
    gui.define_popup({name:'error-traceback', widget: ErrorTracebackPopupWidget});
})
