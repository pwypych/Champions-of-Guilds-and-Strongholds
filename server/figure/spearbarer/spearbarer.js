// @format

'use strict';

module.exports = () => {
  return {
    produce: () => {
      return {
        figure: 'spearbarer',
        battle: {
          name: 'spearbarer',
          movement: 3,
          attack: 1,
          defence: 1,
          range: 2,
          liveMax: 5,
          live: 5,
          amount: 10
        }
      };
    }
  };
};
