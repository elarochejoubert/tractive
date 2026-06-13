# node-red-contrib-tractive

A Node-RED palette for the [Tractive](https://tractive.com) GPS tracker API. Monitor your pet's battery level, location, and history — and control LED and buzzer — directly from your flows.

## Installation

Install via the Node-RED Palette Manager (search for `node-red-contrib-tractive`), or from the command line in your Node-RED data directory:

```bash
npm install node-red-contrib-tractive
```

## Nodes

### tractive-config

A configuration node that stores your Tractive account credentials. One config node per account — shared across all `tractive-tracker` nodes in your flow.

| Field    | Description                         |
|----------|-------------------------------------|
| Email    | Your Tractive account email         |
| Password | Your Tractive account password      |

Authentication is performed automatically when the first operation runs.

---

### tractive-tracker

Calls the Tractive API for a specific tracker. Configure the **Tracker ID** once (find it in the Tractive app under **Settings → Device → Device ID**) and select the operation.

#### Operations

| Operation               | Description                                              |
|-------------------------|----------------------------------------------------------|
| Get hardware            | Battery level and charging state                         |
| Get location            | Latest GPS fix with coordinates and address              |
| Get history             | Location history (requires `msg.from` and `msg.to`)      |
| Live tracking ON / OFF  | Enable or disable 2.5-second position updates            |
| LED ON / OFF            | Trigger the tracker's LED light                          |
| Buzzer ON / OFF         | Trigger the tracker's buzzer                             |
| Get pets                | List all pets on the account                             |
| Get all trackers        | List all trackers on the account                         |

#### Runtime overrides

| Property        | Description                                    |
|-----------------|------------------------------------------------|
| `msg.trackerID` | Overrides the Tracker ID set in the node       |
| `msg.operation` | Overrides the operation set in the node        |
| `msg.from`      | Start timestamp in ms (Get history only)       |
| `msg.to`        | End timestamp in ms (Get history only)         |

#### Output

`msg.payload` contains the raw API response object.

#### Example — battery monitor

```
[inject every 5 min] → [tractive-tracker: getTrackerHardware] → [msg.payload.battery_level] → [display]
```

## JavaScript library

The package also works as a standalone ESM library:

```js
import tractive from 'node-red-contrib-tractive';

await tractive.connect('email@example.com', 'password');

const hw = await tractive.getTrackerHardware('YOUR_TRACKER_ID');
console.log(hw.battery_level); // e.g. 85

const location = await tractive.getTrackerLocation('YOUR_TRACKER_ID');
console.log(location.latlong); // e.g. [-33.86, 151.20]
```

### All functions

```js
// Account
getAccountInfo()
getAccountSubscriptions()
getAccountSubscription(subscriptionID)
getAccountShares()

// Pet
getPets()
getPet(petID)

// Tracker
getAllTrackers()
getTracker(trackerID)
getTrackerLocation(trackerID)
getTrackerHardware(trackerID)       // includes battery_level, charging_state
getTrackerHistory(trackerID, from, to)  // from/to are timestamps in ms

// Commands
liveOn(trackerID)
liveOff(trackerID)
LEDOn(trackerID)
LEDOff(trackerID)
buzzerOn(trackerID)
buzzerOff(trackerID)
```

## Notes

- Rate-limited requests (HTTP 4006) are automatically retried up to 3 times with a 2-second delay.
- This package is not affiliated with or maintained by Tractive. Tractive is a registered trademark of Tractive GmbH.
