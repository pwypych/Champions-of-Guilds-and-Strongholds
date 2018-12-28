// @format

'use strict';

const debug = require('debug')('cogs:heroJourneyCancelPost');

// What does this module do?
// Cancel actual heroJourney
module.exports = (db) => {
  return (req, res) => {
    const game = res.locals.game;
    const playerIndex = res.locals.playerIndex;

    (function init() {
      debug('init');
      checkIsHeroJourneyCancel();
    })();

    function checkIsHeroJourneyCancel() {
      if (game.playerArray[playerIndex].hero.isHeroJourneyCancel) {
        debug('checkIsHeroJourneyCancel: heroJourney already canceled');
        res.send({ error: 0 });
        return;
      }

      updateSetIsHeroJourneyCancel();
    }

    function updateSetIsHeroJourneyCancel() {
      const query = { _id: game._id };
      const string = 'playerArray.' + playerIndex + '.hero.isHeroJourneyCancel';
      const $set = {};
      $set[string] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateSetIsHeroJourneyCancel: error: ', error);

          waitBeforCancelFlag();
        }
      );
    }

    function waitBeforCancelFlag() {
      setTimeout(() => {
        debug('******************** after timeout ********************');
        unsetIsHeroJourneyCancel();
      }, 3000);
    }

    function unsetIsHeroJourneyCancel() {
      const query = { _id: game._id };
      const string = 'playerArray.' + playerIndex + '.hero.isHeroJourneyCancel';
      const $unset = {};
      $unset[string] = true;
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('unsetIsHeroJourneyCancel: Done! | error: ', error);
          sendResponce();
        }
      );
    }

    function sendResponce() {
      res.send({ error: 0 });
      debug('******************** ajax ********************');
    }
  };
};
