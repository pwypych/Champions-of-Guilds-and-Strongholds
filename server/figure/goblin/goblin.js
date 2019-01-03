// @format

'use strict';

module.exports = () => {
  return {
    produce: () => {
      return {
        figure: 'goblin',
        battle: {
          name: 'goblin',
          movement: 3,
          attack: 2,
          defence: 2,
          range: 1,
          liveMax: 4,
          live: 4,
          amount: 30
        }
      };
    }
  };
};
