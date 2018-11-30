// @format

'use strict';

g.world.initCharm = (app) => {
  const charm = new Charm(PIXI);

  app.ticker.add(() => {
    charm.update();
  });

  return charm;
};
