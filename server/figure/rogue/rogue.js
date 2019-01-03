// @format

'use strict';

module.exports = () => {
  return {
    produce: () => {
      return {
        figure: 'rogue',
        battle: {
          name: 'rogue',
          movement: 5,
          attack: 2,
          defence: 1,
          range: 1,
          liveMax: 3,
          live: 3,
          amount: 20
        }
      };
    }
  };
};
