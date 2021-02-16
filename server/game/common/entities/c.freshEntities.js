// @format

'use strict';

// What does this module do?
// Holds entities object, and refreshes it with every new entities every time they are downloaded
g.setup.freshEntities = (walkie) => {
  let entities = {};

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGetEvent_',
      'freshEntities.js',
      (data) => {
        entities = data;
      },
      false
    );
  }

  function read() {
    return entities;
  }

  return read;
};
