// @format

'use strict';

g.setup.setupTween = (app) => {
  app.ticker.add((delta) => {
    PIXI.tweenManager.update(delta);
  });
};
