// @format

'use strict';

const debug = require('debug')('cogs:ajax:worldState:hero:moveToPost');

// What does this module do?
// Change hero position on map
module.exports = (db) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;

    // check if possible
    // check if hero is one step from wished position
    // check if not moving
    // update db to is moving
    // find hero
    // move hero
    // wait 500ms
    // update db to not moving

    (function init() {
      debug('init');
      checkRequestBody();
    })();

    function checkRequestBody() {
      if (typeof req.body.moveToX !== 'string') {
        res.status(400);
        res.send('400 Bad Request - POST parameter moveToX not defined');
        return;
      }

      if (typeof req.body.moveToY !== 'string') {
        res.status(400);
        res.send('400 Bad Request - POST parameter moveToX not defined');
        return;
      }

      const moveToX = parseInt(req.body.moveToX, 10);
      const moveToY = parseInt(req.body.moveToY, 10);

      debug('checkRequestBody', req.body);
      checkIsPossible(moveToX, moveToY);
    }

    function checkIsPossible(moveToX, moveToY) {
      if (!game.mapLayer[moveToY] || !game.mapLayer[moveToY][moveToX]) {
        debug(
          'checkIsPossible: map position not found: moveToY, moveToX:',
          moveToY,
          moveToX
        );
        res.send({ error: 'map position not found' });
        return;
      }

      if (game.mapLayer[moveToY][moveToX].collision) {
        debug(
          'checkIsPossible: cannot move because collision on: moveToY, moveToX:',
          moveToY,
          moveToX
        );
        res.send({ error: 'collision' });
        return;
      }

      debug(
        'checkIsPossible: yes! will move to: moveToY, moveToX:',
        moveToY,
        moveToX
      );

      updateHeroPosition(moveToX, moveToY);
    }

    function updateHeroPosition(moveToX, moveToY) {
      const query = { _id: game._id };
      const mongoPathX = 'playerArray.' + playerIndex + '.hero.x';
      const mongoPathY = 'playerArray.' + playerIndex + '.hero.y';
      const $set = {};
      $set[mongoPathX] = moveToX;
      $set[mongoPathY] = moveToY;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateHeroPosition: error:', error);
            res
              .status(503)
              .send('503 Service Unavailable - Cannot update game');
            return;
          }

          res.send({ error: 0 });
          debug('******************** ajax ********************');
        }
      );
    }
  };
};
