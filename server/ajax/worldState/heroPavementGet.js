// @format

'use strict';

const debug = require('debug')('cogs:heroPavementGet');

// What does this module do?
// Get herpPavement, make initial verification
module.exports = (walkie) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;
    const heroPathArray = [];

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
        heroPathArray.push(wishedPosition);
      });

      debug('checkRequestBody: heroPathArray', heroPathArray);
      sendResponce();
    }

    function sendResponce() {
      res.send({ error: 0 });
      debug('******************** ajax ********************');
      walkie.triggerEvent('wishedHeroPath_', 'heroPathArrayGet.js', {
        gameId: game._id,
        playerIndex: playerIndex,
        pathArray: heroPathArray
      });
    }
  };
};
