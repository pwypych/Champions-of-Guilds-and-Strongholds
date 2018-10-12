// @format

'use strict';

const validator = require('validator');
const shortid = require('shortid');

module.exports = () => {
  function sanitizeMapName(dirty) {
    const clean = validator.whitelist(
      dirty,
      'abcdefghijklmnopqrstuvwxyz01234567890|_'
    );
    return clean;
  }

  function isValidShortId(input) {
    return shortid.isValid(input);
  }

  return {
    sanitizeMapName: sanitizeMapName,
    isValidShortId: isValidShortId
  };
};
