// @format

'use strict';

g.engine.stateChange = (walkie) => {
  let currentState;

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'stateChange.js',
      (entities) => {
        compareWithOldState(entities);
      },
      false
    );
  }

  function compareWithOldState(entities) {
    const gameEntity = entities[entities._id];

    if (currentState !== gameEntity.state) {
      walkie.triggerEvent('stateChange_', 'stateChange.js', gameEntity.state);
      currentState = gameEntity.state;
    }
  }
};
