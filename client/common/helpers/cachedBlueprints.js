// @format

'use strict';

g.common.cachedBlueprints = (auth) => {
  let cachedBlueprints = {};

  (function init() {
    console.log('init g.common.cachedBlueprints');
    getCachedBlueprints();
  })();

  function getCachedBlueprints() {
    $.get('/ajax/blueprint/blueprintGet' + auth.uri, (blueprints) => {
      console.log('getCachedBlueprints: blueprints:', blueprints);
      cachedBlueprints = blueprints;
    });
  }

  function read() {
    return cachedBlueprints;
  }

  return read;
};
