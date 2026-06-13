const RATE_LIMIT_CODE = 4006;
const RATE_LIMIT_DELAY_MS = 2000;
const MAX_RETRIES = 3;

async function commandFetch(url, retries = MAX_RETRIES) {
    const res = await fetch(url, {
        method: gloOpts.method,
        headers: gloOpts.headers
    });
    const data = await res.json();
    if (data?.code === RATE_LIMIT_CODE && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY_MS));
        return commandFetch(url, retries - 1);
    }
    return data;
}

/**
 * Toggle live tracking mode on for a tracker.
 * @param {String} trackerID
 * @returns {Object} Object
 */
export async function liveOn(trackerID) {
    if(!isAuthenticated()) return console.log('Not authenticated.');
    return commandFetch(`https://graph.tractive.com/4/tracker/${trackerID}/command/live_tracking/on`);
}

/**
 * Toggle live tracking mode off for a tracker.
 * @param {String} trackerID
 * @returns {Object} Object
 */
export async function liveOff(trackerID) {
    if(!isAuthenticated()) return console.log('Not authenticated.');
    return commandFetch(`https://graph.tractive.com/4/tracker/${trackerID}/command/live_tracking/off`);
}

/**
 * Turn the trackers LED light on for the specified tracker.
 * @param {String} trackerID
 * @returns {Object} Object
 */
export async function LEDOn(trackerID) {
    if(!isAuthenticated()) return console.log('Not authenticated.');
    return commandFetch(`https://graph.tractive.com/4/tracker/${trackerID}/command/led_control/on`);
}

/**
 * Turn the trackers LED light off for the specified tracker.
 * @param {String} trackerID
 * @returns {Object} Object
 */
export async function LEDOff(trackerID) {
    if(!isAuthenticated()) return console.log('Not authenticated.');
    return commandFetch(`https://graph.tractive.com/4/tracker/${trackerID}/command/led_control/off`);
}

/**
 * Turn the trackers buzzer sound on for the specified tracker.
 * @param {String} trackerID
 * @returns {Object} Object
 */
export async function BuzzerOn(trackerID) {
    if(!isAuthenticated()) return console.log('Not authenticated.');
    return commandFetch(`https://graph.tractive.com/4/tracker/${trackerID}/command/buzzer_control/on`);
}

/**
 * Turn the trackers buzzer sound off for the specified tracker.
 * @param {String} trackerID
 * @returns {Object} Object
 */
export async function BuzzerOff(trackerID) {
    if(!isAuthenticated()) return console.log('Not authenticated.');
    return commandFetch(`https://graph.tractive.com/4/tracker/${trackerID}/command/buzzer_control/off`);
}
