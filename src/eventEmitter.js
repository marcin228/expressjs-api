"use strict";
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
const EVENTS = {
  PROFILE_UPDATED: "profileUpdated",
};
module.exports = { eventEmitter, EVENTS };
