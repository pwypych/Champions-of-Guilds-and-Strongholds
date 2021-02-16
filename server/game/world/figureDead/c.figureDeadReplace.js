// @format

'use strict';

// What does this module do?
// Hides figure and shows blood, dust or grave after figure has been killed/removed
g.autoload.figureDeadReplace = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onViewPortWorldReady();
    onRecentActivityDifferanceDone();
  })();

  function onViewPortWorldReady() {
    walkie.onEvent(
      'viewportWorldReadyEvent_',
      'figureDeadReplace.js',
      () => {
        forEachFigure();
      },
      false
    );
  }

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'figureDeadReplace.js',
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
