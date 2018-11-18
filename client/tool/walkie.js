// @format

'use strict';

g.tool.walkie = () => {
  const walkie = $('body');

  walkie.triggerEvent = (eventName, moduleName, data, isConsoleLog) => {
    if (isConsoleLog !== false) {
      if (!data || _.isEmpty(data)) {
        console.log(moduleName, '-> TRIGGER', eventName);
      } else {
        console.log(moduleName, '-> TRIGGER', eventName, ':', data);
      }
    }
    walkie.trigger(eventName, data);
  };

  walkie.onEvent = (eventName, moduleName, callback, isConsoleLog) => {
    walkie.on(eventName, (event, ...args) => {
      const argsArray = _.values(args);
      if (isConsoleLog !== false) {
        if (!argsArray || _.isEmpty(argsArray)) {
          console.log(moduleName, '<- LISTEN', eventName);
        } else {
          console.log(moduleName, '<- LISTEN', eventName, ':', argsArray[0]);
        }
      }
      callback.apply(this, args);
    });
  };

  return walkie;
};
