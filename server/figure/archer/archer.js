// @format

'use strict';

module.exports = () => {
  return {
    produce: () => {
      return {
        figure: 'archer',
        battle: {
          name: 'archer',
          movement: 3,
          attack: 3,
          defence: 1,
          range: 5,
          liveMax: 3,
          live: 3,
          amount: 20
        }
      };
    }
  };
};
