// @format

'use strict';

const debug = require('debug')('cogs:hook');

// What does this module do?
// It generates empty blueprint object and adds blueprints from from all generateBlueprints_ hooks
module.exports = (hook, callback) => {
  const injected = { blueprint: { figure: {}, unit: {}, race: {}, fortification: {} } };
  hook.run('generateBlueprints_', injected, (error) => {
    // hook mutates injected

    debug('hook run: generateBlueprints_');
    callback(null, injected.blueprint);
  });
};
