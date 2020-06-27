const EventEmitter = require("events");

const increaseMaxListeners = () => {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(100);
};

const appConfig = () => {
  increaseMaxListeners();
};

module.exports = {
  appConfig,
};
