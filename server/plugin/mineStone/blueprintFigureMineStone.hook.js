// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_mineStone = {
      blueprintType: 'figure',
      collision: true,
      visitableText: 'You have annexed a stone mine to your kingdom. <br> +1 stone a day',
      visitableType: 'ok',
      visitableRoute: '/visitable/mineStone',
    };

    done();
  });
};
