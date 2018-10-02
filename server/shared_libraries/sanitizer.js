// @format

'use strict';

const validator = require('validator');

module.exports = () => {
  function sanitizeMapName(dirty) {
    const clean = validator.whitelist(
      dirty,
      'abcdefghijklmnopqrstuvwxyz01234567890|_'
    );
    return clean;
  }

  return {
    sanitizeMapName: sanitizeMapName
  };
};
