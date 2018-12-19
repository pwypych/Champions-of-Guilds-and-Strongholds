// @format

'use strict';

g.engine.freshEntities = (walkie) => {
  let entities = {};

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
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
