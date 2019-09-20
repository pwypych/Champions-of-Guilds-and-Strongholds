// @format

'use strict';

g.world.figuresReplaceDead = (walkie, viewport, freshEntities) => {
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onRecentActivityDifferanceDone();
  })();

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'entitiesGet_',
      'figuresReplaceDead.js',
      () => {
        forEachFigure();
      },
      false
    );
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.figureName && entity.position) {
        replaceSpriteDead(entity, id);
      }
    });
  }

  function replaceSpriteDead(entity, figureId) {
    const figureContainer = worldContainer.getChildByName(figureId);

    if (!figureContainer) {
      return;
    }

    const sprite = figureContainer.getChildByName('sprite');

    if (!sprite) {
      return;
    }

    if (entity.dead && entity.resource) {
      const textureName = 'resourceDead';
      const texture = PIXI.loader.resources[textureName].texture;
      sprite.texture = texture;
    }

    if (entity.dead && entity.unitAmounts) {
      const textureName = 'unitDead';
      const texture = PIXI.loader.resources[textureName].texture;
      sprite.texture = texture;
    }

    if (entity.dead && entity.heroStats) {
      const textureName = 'grave';
      const texture = PIXI.loader.resources[textureName].texture;
      sprite.x = 0;
      sprite.y = 0;
      sprite.texture = texture;
    }
  }
};
