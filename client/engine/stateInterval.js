// @format

'use strict';

g.engine.stateInterval = (walkie, auth) => {
  const every = 300;

  (function init() {
    createInterval();
  })();

  function createInterval() {
    stateDataGet(); // first run

    setInterval(() => {
      stateDataGet();
    }, every);
  }

  function stateDataGet() {
    $.get('/ajax/stateDataGet' + auth.uri, (stateData) => {
      walkie.triggerEvent(
        'stateDataGet_',
        'stateInterval.js',
        stateData,
        false
      );
    });
  }
};
