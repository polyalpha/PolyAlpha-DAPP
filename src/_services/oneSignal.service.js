const LocalData = require('../_services/LocalData');
const Config = require('../_configs/Config');

module.exports.initialize = function () {
    if (LocalData.getAddress() != "") {
        var OneSignal = window.OneSignal || [];
        if (OneSignal.isInitialized == undefined) {
            OneSignal.isInitialized = true;
            OneSignal.push(function() {
                OneSignal.init({
                appId: Config.PUSH_APP_ID,
                autoRegister: true,
                notifyButton: {
                    enable: false,
                },
                });
                OneSignal.sendTag("address", LocalData.getAddress());
            });
        }
    }
}

module.exports.initialize();