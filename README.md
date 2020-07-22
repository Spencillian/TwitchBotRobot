# Twitch Bot Robot

> The code for this bot is home cooked specifically for this use case

## Summary

This repo combines the RaspberryPi's Gpio library with with Twitch's tmi.js library to make a robot that moves based on bot commands.

## How it Works

### Twitch Bot - index.js

Defined in this file is a twitch bot that controls the robot with imported functions.

- Forward: `!f {millis}`
- Back: `!b {millis}`
- Left: `!l {millis}`
- Right: `!r {millis}`
- Stop: `!stop`
- Help: `!help`

This code is run on a RaspberryPi 3B (I think) located on the robot and powered by an onboard battery.

### Motor Control - motorControl.js

Inside this file is where all of the hardware controls lie. This takes in the various bot commands and turns them into GPIO pin outputs. It also manages the Gpio resources and implements a cleanup function. The outputs are then piped to a L298N motor controller board which controls the direction of the motors.
