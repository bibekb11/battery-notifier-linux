const notifier = require('node-notifier');
const si = require('systeminformation');

console.log('battery-notifier-linux service started.');

let isCharging = false,
    batteryLevel = 100,
    isNotifiedHigh = false,
    isNotifiedLow = false;

batteryMonitorService = async() => {
    try {
        let data = await si.battery();
        isCharging = data.ischarging;
        batteryLevel = data.percent;

        if (batteryLevel <= 35 && isCharging === false && isNotifiedLow === false) {
            notifier.notify({
                title: 'Plug the charger!',
                message: 'Your battery percentage is getting low. \nPlease plug the charger!',
            }, err => { 
                if(err) console.error(`error: ${err}`) ;
                isNotifiedLow = true;
            });
        } else if (batteryLevel <= 35 && isCharging === true && isNotifiedLow === true){ 
            isNotifiedLow = false;
        } else if (batteryLevel >= 85 && isCharging === true && isNotifiedHigh === false) {
            notifier.notify({
                title: 'Unplug the charger!',
                message: 'Battery is now sufficiently charged. \nYou may unplug the charger!',
            }, err => { 
                if(err) console.error(`error: ${err}`) ;
                isNotifiedHigh = true;
            });
        } else if (batteryLevel >= 85 && isCharging === false && isNotifiedHigh === true) {
            isNotifiedHigh = false;
        }
    } catch (err) {
        notifier.notify({
            title: 'Error during battery-notifier-linux runtime',
            message: err,
        });
    }
}

setInterval(batteryMonitorService, 30000);
