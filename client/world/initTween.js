// @format

'use strict';

g.world.initTween = (app) => {
  app.ticker.add((delta) => {
    PIXI.tweenManager.update(delta);
  });
};
