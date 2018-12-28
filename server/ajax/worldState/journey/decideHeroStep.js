// @format

'use strict';

const debug = require('debug')('cogs:decideHeroStep');

// What does this module do?
// Change hero position
module.exports = (updateHeroPosition) => {
  return () => {
    (function init() {
      debug('init');

      updateHeroPosition();
    })();
  };
};
