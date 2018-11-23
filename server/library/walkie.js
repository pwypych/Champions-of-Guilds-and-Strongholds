// @format

'use strict';

const EventEmitter = require('events');
const _ = require('lodash');

module.exports = () => {
  const emitter = new EventEmitter();

  const walkie = {};

  walkie.triggerEvent = (eventName, moduleName, data, isDebug) => {
    if (isDebug !== false) {
      if (!data || _.isEmpty(data)) {
        console.log(' ', moduleName, '-> TRIGGER', eventName);
      } else {
        console.log(' ', moduleName, '-> TRIGGER', eventName, ':', data);
      }
    }
    emitter.emit(eventName, data);
  };

  walkie.onEvent = (eventName, moduleName, callback, isDebug) => {
    emitter.on(eventName, (...args) => {
      const argsArray = _.values(args);
      if (isDebug !== false) {
        if (!argsArray || _.isEmpty(argsArray)) {
          console.log(' ', moduleName, '<- LISTEN', eventName);
        } else {
          console.log(
            ' ',
            moduleName,
            '<- LISTEN',
            eventName,
            ':',
            argsArray[0]
          );
        }
      }
      callback.apply(this, args);
    });
  };

  return walkie;
};
