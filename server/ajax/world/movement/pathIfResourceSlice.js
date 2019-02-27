// @format

'use strict';

const debug = require('debug')('cogs:pathIsResource');
const _ = require('lodash');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Verifies if resource is present on path and slices path');
      const entities = res.locals.entities;
      const path = res.locals.path;

      checkResourceAtIndex(entities, path);
    })();

    function checkResourceAtIndex(entities, path) {
      let resourceAtIndex;

      _.forEach(path, (position, index) => {
        if (resourceAtIndex) {
          return;
        }

        _.forEach(entities, (entity) => {
          if (entity.resource) {
            if (
              entity.position.x === position.x &&
              entity.position.y === position.y
            ) {
              debug(
                'checkResourceAtIndex: Resource found!: position:',
                position
              );
              resourceAtIndex = index;
            }
          }
        });
      });

      if (!resourceAtIndex) {
        debug('checkResourceAtIndex: No resource found!');
        next();
        return;
      }

      slicePath(path, resourceAtIndex);
    }

    function slicePath(pathOriginal, resourceAtIndex) {
      const path = pathOriginal.slice(0, resourceAtIndex + 1);
      res.locals.path = path;

      debug('slicePath: index:', resourceAtIndex + 1);
      next();
    }
  };
};
