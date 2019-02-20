// @format

'use strict';

const debug = require('debug')('cogs:unitPathSendResponce');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug(
        '// Sends response for journey result, waits some time (for animation on front), and passes to next, for processing of path result'
      );

      sendResponce();
    })();

    function sendResponce() {
      debug('sendResponce: No Errors!');
      res.send({ error: 0 });
      next();
    }
  };
};
