// @format

'use strict';

g.world.colorFlagDraw = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onViewPortWorldReady();
    onRecentActivityDifferanceDone();
  })();

  function onViewPortWorldReady() {
    walkie.onEvent(
      'viewportWorldReady_',
      'colorFlagDraw.js',
      () => {
        forEachFigure();
      },
      false
    );
  }

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'colorFlagDraw.js',
      () => {
        forEachFigure();
      },
      false
    );
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.figureName && entity.position && entity.color) {
        checkSpriteExists(entity, id);
      }
    });
  }

  function checkSpriteExists(entity, figureId) {
    const figureContainer = worldContainer.getChildByName(figureId);

    if (!figureContainer) {
      return;
    }

    const sprite = figureContainer.getChildByName('sprite');

    if (!sprite) {
      return;
    }

    drawAmount(entity, figureId);
  }

  function drawAmount(entity, figureId) {
    const figureContainer = worldContainer.getChildByName(figureId);
    let flagContainer = figureContainer.getChildByName('flagContainer');

    // Should happen only once
    if (!flagContainer) {
      flagContainer = new PIXI.ContainerZ();
      flagContainer.name = 'flagContainer';
    }

    // Hide all flags
    flagContainer.children.forEach((child) => {
      child.visible = false;
    });

    const flagName = entity.color;
    let flag = figureContainer.getChildByName(flagName);

    // Should happen only once
    if (!flag) {
      const texture = PIXI.loader.resources[entity.color].texture;
      flag = new PIXI.Sprite(texture);
      flag.name = flagName;

      const zOrder = 10;
      figureContainer.addChildZ(flag, zOrder);
      figureContainer.sortChildren();

      const paddingTop = 3;
      flag.x = blockWidthPx - flag.width;
      flag.y = blockHeightPx - flag.height + paddingTop;
    }

    // Show correct flag
    flag.visible = true;
  }
};
