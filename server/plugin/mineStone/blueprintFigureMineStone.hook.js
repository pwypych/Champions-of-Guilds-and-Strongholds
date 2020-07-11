// @format

'use strict';

// What does this module do?
// It attaches blueprint for this figure
module.exports = (hook) => {
  hook.attach('generateBlueprints_', (ctx, done) => {
    ctx.entities.blueprint_figure_mineStone = {
      blueprintType: 'figure',
      collision: true,
      visitableText: 'You have annexed a wood mine. <br> +1 wood a day',
      visitableType: 'ok',
      visitableRoute: '/visitable/mineWood',
    };

    done();
  });
};
