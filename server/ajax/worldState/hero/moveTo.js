// @format

'use strict';

const debug = require('debug')('cogs:ajax:worldState:hero:moveTo');

module.exports = (db) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;

    // check if possible
    // check if not moving
    // move
    // update db to is moving
    // wait 500ms
    // update db to not moving

    let moveToX;
    let moveToY;

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

      moveToX = parseInt(req.body.moveToX, 10);
      moveToY = parseInt(req.body.moveToY, 10);

      debug('checkRequestBody', req.body);
      checkIsPossible();
    }

    function checkIsPossible() {
      if (!game.mapLayer[moveToY][moveToX]) {
        debug(
          'checkIsPossible: map position not found: moveToY, moveToX:',
          moveToY,
          moveToX
        );
        return;
      }

      if (game.mapLayer[moveToY][moveToX].collision) {
        debug(
          'checkIsPossible: cannot move because collision on: moveToY, moveToX:',
          moveToY,
          moveToX
        );
        return;
      }

      debug(
        'checkIsPossible: yes! will move to: moveToY, moveToX:',
        moveToY,
        moveToX
      );

      res.send({ error: 0 });
      debug('******************** ajax ********************');
    }
  };
};
