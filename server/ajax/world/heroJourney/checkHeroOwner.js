// @format

'use strict';

const debug = require('debug')('cogs:checkHeroOwner');

module.exports = () => {
  return (req, res, next) => {
    (function init() {
      debug('// Middleware, compare hero owner component with playerId');

      const entities = res.locals.entities;
      const playerId = res.locals.playerId;
      const hero = entities[res.locals.heroId];

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
