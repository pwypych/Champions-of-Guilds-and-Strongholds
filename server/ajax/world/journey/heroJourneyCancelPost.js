// @format

'use strict';

const debug = require('debug')('cogs:heroJourneyCancelPost');
const _ = require('lodash');

// What does this module do?
// Cancel actual heroJourney
module.exports = (db) => {
  return (req, res) => {
    (function init() {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;

      debug('init');
      checkIsHeroJourneyCancel(entities, playerId);
    })();

    function checkIsHeroJourneyCancel(entities, playerId) {
      let heroId;
      let isCanceled = false;

      _.forEach(entities, (entity, id) => {
        if (entity.owner === playerId) {
          heroId = id;
          if (entity.isHeroJourneyCancel) {
            debug('checkIsHeroJourneyCancel: heroJourney already canceled');
            isCanceled = true;
          }
        }
      });

      if (isCanceled) {
        res.send({ error: 0 });
        debug('******************** ajax ********************');
        return;
      }

      updateSetIsHeroJourneyCancel(entities, heroId);
    }

    function updateSetIsHeroJourneyCancel(entities, heroId) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const field = heroId + '.isHeroJourneyCancel';
      const $set = {};
      $set[field] = true;
      const update = { $set: $set };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('updateSetIsHeroJourneyCancel: error: ', error);

          waitBeforCancelFlag(entities, heroId);
        }
      );
    }

    function waitBeforCancelFlag(entities, heroId) {
      setTimeout(() => {
        debug('******************** after timeout ********************');
        unsetIsHeroJourneyCancel(entities, heroId);
      }, 3000);
    }

    function unsetIsHeroJourneyCancel(entities, heroId) {
      const gameId = entities._id;
      const query = { _id: gameId };
      const field = heroId + '.isHeroJourneyCancel';
      const $unset = {};
      $unset[field] = true;
      const update = { $unset: $unset };
      const options = {};

      db.collection('gameCollection').updateOne(
        query,
        update,
        options,
        (error) => {
          debug('unsetIsHeroJourneyCancel: Done! | error: ', error);
          res.send({ error: 0 });
          debug('******************** ajax ********************');
        }
      );
    }
  };
};
