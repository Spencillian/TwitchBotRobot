require('dotenv').config()

const tmi = require('tmi.js');

// Importing from motorControl file
const { forward, back, left, right, stop, stopAll } = require('./services/motorControl')

// Defining bot parameters
const client = new tmi.Client({
	options: { debug: true },
	connection: {
		reconnect: true,
		secure: true
	},
	identity: {
		username: `${process.env.USERNAME}`,
		password: `${process.env.PASSWORD}`
	},
	channels: [ 'spncllian' ]
});

// Connecting bot to twitch chat
client.connect();

// Defining behavior when given commands
client.on('message', (channel, tags, message, self) => {
  // Avoid self
  if(self) return;
  
  // Test case to see if bot is alive
	if(message.toLowerCase() === '!hello') {
    client.say(channel, `@${tags.username}, heya!`);
    return;
  }
  
  // Cleaning and parsing input commands
  const temp = message.trim().toLowerCase();
  if(temp.charAt(0) !== '!'){
    return;
  }
  let [cmd, millis] = temp.split(' ');
  
  // Switch case for commands that don't need time inputs
  switch(cmd){
    case '!stop': // Stops robot
      client.say(channel, `Stopping brrrrr`)
      stop()
      return;
    case '!help': // Lists bot commands
      client.say(channel, `Commands:`);
      client.say(channel, ` Forward - !f {millis}`);
      client.say(channel, ` Back - !b {millis}`);
      client.say(channel, ` Left - !l {millis}`);
      client.say(channel, ` Right - !r {millis}`);
      client.say(channel, ` Stop - !stop`);
      client.say(channel, ` Help - !help`);
      return;
    default:
      break;
  }

  // Additional testing of {millis}  
  try{
    millis = parseInt(millis);
  }catch(err){
    client.say(channel, `Invalid time: ${millis} => ${err}`);
    return;
  }

  // Tests if {millis} is an Integer
  if(!Number.isInteger(millis)){
    client.say(channel, `Invalid time: ${millis}`);
    return;
  }

  // Switch case for commands with time input
  switch(cmd){
    case '!f': // Move forward
      client.say(channel, `Going brrrrr forward ${millis}`);
      console.log(`${cmd} ${millis}`);
      forward(millis);
      break;
    case '!b': // Move backward
      client.say(channel, `Going brrrrr backward ${millis}`);
      console.log(`${cmd} ${millis}`);
      back(millis);
      break;
    case '!r': // Turn right
      client.say(channel, `Going brrrrr right ${millis}`);
      console.log(`${cmd} ${millis}`);
      right(millis);
      break;
    case '!l': // Turn left
      client.say(channel, `Going brrrrr left ${millis}`);
      console.log(`${cmd} ${millis}`);
      left(millis);
      break;
    default: // Catch invalid commands
      client.say(channel, `Invalid Command: ${cmd}`);
      break;
  }
});

// Debug connection
client.on('connected', (addr, port) =>{
  console.log(`Connected to ${addr}:${port}`);
});

// Listing commands on bot join
client.on('join', (channel, _, self) => {
  if(!self) return;
  client.say(channel, `Commands:`);
  client.say(channel, ` Forward - !f {millis}`);
  client.say(channel, ` Back - !b {millis}`);
  client.say(channel, ` Left - !l {millis}`);
  client.say(channel, ` Right - !r {millis}`);
  client.say(channel, ` Stop - !stop`);
  client.say(channel, ` Help - !help`);
})

// Cleaning up process on exit
process.on('exit', () => {
  stopAll();
  process.exit();
});
process.on('SIGINT', () => {
  stopAll();
  process.exit();
});
process.on('uncaughtException', () => {
  // hmmmmmm
  console.log('Oops I did a fucky wucky')
  stopAll();
  process.exit();
});