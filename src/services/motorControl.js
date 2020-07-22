const Gpio = require('onoff').Gpio;
const sleep = require('util').promisify(setTimeout);

// Setting up the GPIO pins and data structure
const leftPower = [new Gpio(22, 'out'), new Gpio(27, 'out')];
const rightPower = [new Gpio(24, 'out'), new Gpio(23, 'out')];

const FORWARD = 0;
const BACK = 1;

// Apply forward movement to the robot for {millis} time
const forward = async millis => {
  leftPower[FORWARD].writeSync(1);
  rightPower[FORWARD].writeSync(1);
  await sleep(millis);
  leftPower[FORWARD].writeSync(0);
  rightPower[FORWARD].writeSync(0);
}

// Apply backward movement to the robot for {millis} time
const back = async millis => {
  leftPower[BACK].writeSync(1);
  rightPower[BACK].writeSync(1);
  await sleep(millis);
  leftPower[BACK].writeSync(0);
  rightPower[BACK].writeSync(0);
}

// Turn right for {millis} time
const right = async millis => {
  rightPower[FORWARD].writeSync(1);
  leftPower[BACK].writeSync(1);
  await sleep(millis);
  rightPower[FORWARD].writeSync(0);
  leftPower[BACK].writeSync(0);
}

// Turn left for {millis} time
const left = async millis => {
  rightPower[BACK].writeSync(1);
  leftPower[FORWARD].writeSync(1);
  await sleep(millis);
  rightPower[BACK].writeSync(0);
  leftPower[FORWARD].writeSync(0);
}

// Test specific motors with this
// const test = async millis => {
//   leftPower[FORWARD].writeSync(1);
//   await sleep(millis);
//   leftPower[FORWARD].writeSync(0);
// }

// Stops all motors
const stop = async () => {
  leftPower.forEach(pin => {
    pin.writeSync(0);
  })
  rightPower.forEach(pin => {
    pin.writeSync(0);
  })
}

// Stops all motors and cleans up used resources
const stopAll = async () => {
  leftPower.forEach(pin => {
    pin.writeSync(0);
    pin.unexport();
  })
  rightPower.forEach(pin => {
    pin.writeSync(0);
    pin.unexport();
  })
  console.log('Stopped + Exported Motors')
}

// Exporting all functions
module.exports ={
  forward,
  stopAll,
  back,
  left,
  right,
  stop
}