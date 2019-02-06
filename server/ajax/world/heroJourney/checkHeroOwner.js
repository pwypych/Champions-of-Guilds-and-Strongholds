// @format

'use strict';

const debug = require('debug')('cogs:checkHeroOwner');

// What does this module do?
// Middleware, compare hero owner component with playerId
module.exports = () => {
  return (req, res, next) => {
    (function init() {
      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      const hero = entities[res.locals.heroId];

      debug('init: playerId:', playerId);
      debug('init: hero:', hero);
      checkHeroOwner(hero, playerId);
    })();

    function checkHeroOwner(hero, playerId) {
      if (hero.owner !== playerId) {
        debug(
          'checkHeroOwner: owner and playerId are different, hero.owner:',
          hero.owner,
          'playerId',
          playerId
        );
        return;
      }

      debug('checkHeroOwner: hero.owner:', hero.owner);
      next();
    }
  };
};
