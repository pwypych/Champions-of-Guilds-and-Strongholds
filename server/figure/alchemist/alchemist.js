// @format

'use strict';

module.exports = () => {
  return {
    produce: () => {
      return {
        figure: 'alchemist',
        battle: {
          name: 'alchemist',
          movement: 2,
          attack: 4,
          defence: 1,
          range: 5,
          liveMax: 3,
          live: 3,
          amount: 10
        }
      };
    }
  };
};
