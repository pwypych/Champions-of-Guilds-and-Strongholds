// @format

'use strict';

const debug = require('debug')('cogs:checkHeroOwnerComponent');

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
      checkHeroOwnerComponent(hero, playerId);
    })();

    function checkHeroOwnerComponent(hero, playerId) {
      if (hero.owner !== playerId) {
        debug(
          'checkHeroOwnerComponent: owner and playerId are different, hero.owner:',
          hero.owner,
          'playerId',
          playerId
        );
        return;
      }

      debug('checkHeroOwnerComponent: hero.owner:', hero.owner);
      next();
    }
  };
};
