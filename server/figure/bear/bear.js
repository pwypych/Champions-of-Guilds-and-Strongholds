// @format

'use strict';

module.exports = () => {
  return {
    produce: () => {
      return {
        figure: 'bear',
        battle: {
          name: 'bear',
          movement: 4,
          attack: 3,
          defence: 3,
          range: 1,
          liveMax: 7,
          live: 7,
          amount: 5
        }
      };
    }
  };
};
