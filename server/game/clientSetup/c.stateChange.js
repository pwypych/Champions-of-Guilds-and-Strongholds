// @format

'use strict';

// What does this module do?
// Checks state changes in entities and triggers event if state was changed
g.autoload.stateChange = (inject) => {
  const walkie = inject.walkie;

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
