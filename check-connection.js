import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import tractive from './index.js';

const rl = readline.createInterface({ input, output });

const email = await rl.question('Tractive email: ');
const password = await rl.question('Password: ');
rl.close();

console.log('\nConnecting...');
const connected = await tractive.connect(email, password);

if (!connected) {
    console.error('Authentication failed. Check your credentials.');
    process.exit(1);
}

console.log('Authenticated successfully.\n');

const trackers = await tractive.getAllTrackers();

if (!trackers?.length) {
    console.log('No trackers found on this account.');
    process.exit(0);
}

console.log(`Found ${trackers.length} tracker(s):\n`);

for (const tracker of trackers) {
    const hw = await tractive.getTrackerHardware(tracker._id);
    const battery = hw?.battery_level != null ? `${hw.battery_level}%` : 'unknown';
    const charging = hw?.charging_state ?? 'unknown';
    console.log(`Tracker: ${tracker._id}`);
    console.log(`  Battery : ${battery}`);
    console.log(`  Charging: ${charging}\n`);
}

const firstID = trackers[0]._id;

// --- getTrackerLocation ---
console.log('--- getTrackerLocation ---');
const location = await tractive.getTrackerLocation(firstID);
console.log(`  latlong : ${location?.latlong}`);
console.log(`  address : ${JSON.stringify(location?.address)}\n`);

// --- getTrackerHistory (last 24h) ---
console.log('--- getTrackerHistory (last 24h) ---');
const to = new Date();
const from = new Date(Date.now() - 24 * 60 * 60 * 1000);
const history = await tractive.getTrackerHistory(firstID, from.getTime(), to.getTime());
const count = Array.isArray(history) ? history.length : (history ? 1 : 0);
console.log(`  entries : ${count}\n`);

// --- getPets ---
console.log('--- getPets ---');
const pets = await tractive.getPets();
console.log(`  pets found : ${pets?.length ?? 0}`);
for (const p of pets ?? []) {
    console.log(`  pet: ${p._id} — ${p.name ?? p._type}`);
}
console.log('');

// --- getPet (first pet) ---
if (pets?.length) {
    console.log('--- getPet ---');
    const pet = await tractive.getPet(pets[0]._id);
    console.log(`  name    : ${pet?.details?.name ?? 'unknown'}`);
    console.log(`  pic url : ${pet?.details?.profile_picture_link ?? 'none'}\n`);
}

// --- Control commands (liveOn / liveOff / LED / Buzzer) ---
// console.log('--- liveOn ---');
// const liveOnResult = await tractive.liveOn(firstID);
// console.log(`  result: ${JSON.stringify(liveOnResult)}`);

// console.log('--- liveOff ---');
// const liveOffResult = await tractive.liveOff(firstID);
// console.log(`  result: ${JSON.stringify(liveOffResult)}\n`);

await new Promise(resolve => setTimeout(resolve, 5000));
console.log('--- LEDOn ---');
const ledOnResult = await tractive.LEDOn(firstID);
console.log(`  result: ${JSON.stringify(ledOnResult)}`);

console.log('--- LEDOff ---');
const ledOffResult = await tractive.LEDOff(firstID);
console.log(`  result: ${JSON.stringify(ledOffResult)}\n`);

await new Promise(resolve => setTimeout(resolve, 5000));
console.log('--- buzzerOn ---');
const buzzerOnResult = await tractive.buzzerOn(firstID);
console.log(`  result: ${JSON.stringify(buzzerOnResult)}`);

console.log('--- buzzerOff ---');
const buzzerOffResult = await tractive.buzzerOff(firstID);
console.log(`  result: ${JSON.stringify(buzzerOffResult)}\n`);

console.log('All checks complete.');
