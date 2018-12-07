// @format

'use strict';

const debug = require('debug')('cogs:ajax:worldState:hero:moveToPost');

// What does this module do?
// Change hero position on map
module.exports = (db) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;
    const hero = game.playerArray[playerIndex].hero;
    let moveToX;
    let moveToY;

    // X check if possible
    // X check if hero is one step from wished position
    // X check if just moved
    // X move hero
    // X update db to just moved
    // X wait 500ms
    // X update db delete just moved flag

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

      isOneStepFromWishedPosition();
    }

    function isOneStepFromWishedPosition() {
      const distanceX = Math.abs(hero.x - moveToX);
      const distanceY = Math.abs(hero.y - moveToY);

      if (distanceX !== 0 && distanceX !== 1) {
        debug(
          'isOneStepFromWishedPosition: cannot move more than one step:',
          moveToY,
          moveToX
        );
        res.send({ error: 'Cannot move more than one step' });
        return;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        debug(
          'isOneStepFromWishedPosition: cannot move more than one step:',
          moveToY,
          moveToX
        );
        res.send({ error: 'Cannot move more than one step' });
        return;
      }

      debug(
        'isOneStepFromWishedPosition: distanceX',
        distanceX,
        'distanceY',
        distanceY
      );
      checkIfJustMoved();
    }

    function checkIfJustMoved() {
      const isJustMoved = hero.justMoved;

      if (isJustMoved) {
        debug('checkIfJustMoved: hero was just moved:', moveToY, moveToX);
        res.send({ error: 'hero was just moved' });
        return;
      }

      debug('checkIfJustMoved: isJustMoved', isJustMoved);
      updateHeroPosition();
    }

    function updateHeroPosition() {
      const query = { _id: game._id };
      const mongoPathX = 'playerArray.' + playerIndex + '.hero.x';
      const mongoPathY = 'playerArray.' + playerIndex + '.hero.y';
      const mongoJustMoved = 'playerArray.' + playerIndex + '.hero.justMoved';
      const $set = {};
      $set[mongoPathX] = moveToX;
      $set[mongoPathY] = moveToY;
      $set[mongoJustMoved] = true;
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

          debug('updateHeroPosition: isJustMoved set to true');

          res.send({ error: 0 });
          debug('******************** ajax ********************');

          setTimeout(deleteJustMovedFlag, 300);
        }
      );
    }

    function deleteJustMovedFlag() {
      const query = { _id: game._id };
      const mongoJustMoved = 'playerArray.' + playerIndex + '.hero.justMoved';
      const $unset = {};
      $unset[mongoJustMoved] = 'unset';
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          if (error) {
            debug('updateHeroPosition: error:', error);
          }
          debug('deleteJustMovedFlag: Done!');
        }
      );
    }
  };
};
