// @format

'use strict';

const debug = require('debug')('nope:cogs:entitiesFilterSendResponce');

module.exports = () => {
  return (req, res) => {
    (function init() {
      debug('// Send filtered entities');

      const filteredEntities = res.locals.filteredEntities;

      sendFilteredEntities(filteredEntities);
    })();

    function sendFilteredEntities(filteredEntities) {
      debug('sendFilteredEntities');
      res.send(filteredEntities);
      debug('******************** ajax ********************');
    }
  };
};
