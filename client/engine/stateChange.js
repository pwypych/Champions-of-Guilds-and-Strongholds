// @format

'use strict';

g.engine.stateChange = (walkie) => {
  let currentState;

  (function init() {
    onStateDataGet();
  })();

  function onStateDataGet() {
    walkie.onEvent(
      'stateDataGet_',
      'stateChange.js',
      (stateData) => {
        compareWithOldState(stateData.state);
      },
      false
    );
  }

  function compareWithOldState(state) {
    if (currentState !== state) {
      walkie.triggerEvent('stateChange_', 'stateChange.js', state);
      currentState = state;
    }
  }
};
