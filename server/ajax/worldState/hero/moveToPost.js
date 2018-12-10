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
    const pathArray = [];

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
      req.body.moveArray.forEach((wishedPosition) => {
        if (typeof wishedPosition.x !== 'string') {
          res.status(400);
          res.send('400 Bad Request - POST parameter moveToX not defined');
          return;
        }

        if (typeof wishedPosition.y !== 'string') {
          res.status(400);
          res.send('400 Bad Request - POST parameter moveToX not defined');
          return;
        }

        wishedPosition.x = parseInt(wishedPosition.x, 10);
        wishedPosition.y = parseInt(wishedPosition.y, 10);
        pathArray.push(wishedPosition);
      });

      debug('checkRequestBody: req.body', req.body);
      debug('checkRequestBody: wishedPosition', pathArray);
      checkHeroFirstMove();
    }

    function forEachWishedPosition(pathArray) {
      const done = _.after(pathArray.length, () => {
        debug('forEachPlayer: done!');
        triggerPrepareReady(game);
      });

      pathArray.forEach((place, moveIndex) => {
        debug('forEachWishedPosition', place);
        checkRequestBody(place, moveIndex, done);
      });
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

    // ---------- TOOLS ----------
    function toolCheckIsPossible(positionPoint) {
      if (
        !game.mapLayer[positionPoint.y] ||
        !game.mapLayer[positionPoint.y][positionPoint.x]
      ) {
        debug(
          'checkIsPossible: map position not found: moveToY, moveToX:',
          positionPoint.y,
          positionPoint.x
        );
        return false;
      }

      if (game.mapLayer[positionPoint.y][positionPoint.x].collision) {
        debug(
          'checkIsPossible: cannot move because collision on: moveToY, moveToX:',
          positionPoint.y,
          positionPoint.x
        );
        return false;
      }

      debug(
        'checkIsPossible: yes! will move to: moveToY, moveToX:',
        positionPoint.y,
        positionPoint.x
      );
      return true;
    }

    function toolIsOneStepFromWishedPosition(startPosition, endPosition) {
      const distanceX = Math.abs(startPosition.x - endPosition.x);
      const distanceY = Math.abs(startPosition.y - endPosition.y);

      if (distanceX !== 0 && distanceX !== 1) {
        debug(
          'isOneStepFromWishedPosition: cannot move more than one step:',
          endPosition.y,
          endPosition.x
        );
        return false;
      }

      if (distanceY !== 0 && distanceY !== 1) {
        debug(
          'isOneStepFromWishedPosition: cannot move more than one step:',
          endPosition.y,
          endPosition.x
        );
        return false;
      }

      debug(
        'isOneStepFromWishedPosition: distanceX',
        distanceX,
        'distanceY',
        distanceY
      );
      return true;
    }

    function toolCheckIfJustMoved(positionPoint) {
      const isJustMoved = hero.justMoved;

      if (isJustMoved) {
        debug(
          'checkIfJustMoved: hero was just moved:',
          positionPoint.y,
          positionPoint.x
        );
        return false;
      }

      debug('checkIfJustMoved: isJustMoved', isJustMoved);
      return true;
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
  };
};
