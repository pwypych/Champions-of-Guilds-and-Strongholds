// @format

'use strict';

g.engine.freshStateData = (walkie) => {
  let stateData = {};

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'freshStateData.js',
      (data) => {
        stateData = data;
      },
      false
    );
  }

  function read() {
    return stateData;
  }

  return read;
};
