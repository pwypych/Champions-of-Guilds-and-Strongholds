// @format

'use strict';

const debug = require('debug')('nope:cogs:worldEntitiesFogOfWar');
const _ = require('lodash');
const shortId = require('shortid');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Filters allready prepared entities through fog of war filter');

      const entities = res.locals.entities;

      compareState(entities);
    })();

    function compareState(entities) {
      const gameId = entities._id;
      const gameEntity = entities[gameId];

      if (gameEntity.state !== 'worldState') {
        debug('compareState: not worldState!');
        next();
        return;
      }

      debug('compareState: state ok!', gameEntity.state);
      findFogArray(entities);
    }

    function findFogArray(entities) {
      const playerId = res.locals.playerId;

      let fogArray;

      _.forEach(entities, (entity, id) => {
        // Player current
        if (id === playerId) {
          fogArray = entity.fogArray;
        }
      });

      debug('findFogArray', fogArray.length);
      applyFogOfWar(fogArray);
    }

    function applyFogOfWar(fogArray) {
      const entitiesFiltered = res.locals.entitiesFiltered;
      _.forEach(fogArray, (row, y) => {
        _.forEach(row, (isFog, x) => {
          if (isFog) {
            // Check if figure exists on this fog position
            let figureIdExisting = false;
            _.forEach(entitiesFiltered, (entity, id) => {
              if (entity.position) {
                if (entity.position.x === x && entity.position.y === y) {
                  figureIdExisting = id;
                }
              }

            });

            const fogOfWar = {
              figureName: 'fogOfWar',
              position: {x: x, y: y},
              collision: true
            };

            // If figure on this x y position, then overwrite it with fog, else create fog
            if (figureIdExisting) {
              entitiesFiltered[figureIdExisting] = fogOfWar;
            } else {
              const figureIdNew = 'figure_fogOfWar_' + shortId.generate();
              entitiesFiltered[figureIdNew] = fogOfWar;
            }
          }
        });
      });

      debug('applyFogOfWar');
      addEntitiesFilteredToLocals(entitiesFiltered);
    }

    function addEntitiesFilteredToLocals(entitiesFiltered) {
      debug('addEntitiesFilteredToLocals');
      res.locals.entitiesFiltered = entitiesFiltered;
      next();
    }
  };
};
