// @format

'use strict';

g.common.chachedBlueprints = (auth) => {
  let chachedBlueprints = {};

  (function init() {
    console.log('init');
    getCachedBlueprints();
  })();

  function getCachedBlueprints() {
    $.get('/ajax/blueprint/blueprintGet' + auth.uri, (blueprints) => {
      chachedBlueprints = blueprints;
    });
  }

  function read() {
    return chachedBlueprints;
  }

  return read;
};
