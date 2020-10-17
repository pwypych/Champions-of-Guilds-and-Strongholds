// @format

'use strict';

// What does this module do?
// Downloads entities from endpoint and triggers entitiesGet_ event
g.autoload.entitiesInterval = (inject) => {
  const walkie = inject.walkie;
  const auth = inject.auth;

  const every = 500;

  (function init() {
    createInterval();
  })();

  function createInterval() {
    // first run
    entitiesGet();

    setInterval(() => {
      entitiesGet();
    }, every);
  }

  function entitiesGet() {
    $.post('/ajax/entitiesGet' + auth.uri, (entities) => {
      triggerEntitiesGet(entities);
    });
  }

  function triggerEntitiesGet(entities) {
    walkie.triggerEvent(
      'entitiesGet_',
      'entitiesInterval.js',
      entities,
      false
    );
  }
};
