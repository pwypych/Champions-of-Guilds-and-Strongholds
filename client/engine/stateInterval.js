// @format

'use strict';

g.engine.stateInterval = (auth, walkie) => {
  const every = 500;

  (function init() {
    createInterval();
  })();

  function createInterval() {
    setInterval(() => {
      stateDataGet();
    }, every);
  }

  function stateDataGet() {
    $.get('/ajax/stateDataGet' + auth.uri, (stateData) => {
      walkie.triggerEvent('stateDataGet_', 'stateInterval', stateData);
    });
  }
};
