// @format

'use strict';

const debug = require('debug')('nope:cogs:entitiesFilterSendResponce');

module.exports = () => {
  return (req, res) => {
    (function init() {
      debug('// Send filtered entities');

      const entitiesFiltered = res.locals.entitiesFiltered;

      sendEntitiesFiltered(entitiesFiltered);
    })();

    function sendEntitiesFiltered(entitiesFiltered) {
      debug('sendEntitiesFiltered');
      res.send(entitiesFiltered);
      debug('******************** ajax ********************');
    }
  };
};
