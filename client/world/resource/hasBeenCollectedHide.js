// @format

'use strict';

g.world.hasBeenCollectedHide = (walkie, viewport) => {
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'hasBeenCollectedHide.js',
      (data) => {
        if (data.entity.recentActivity.name === 'hasBeenCollected') {
          const figureId = data.entityId;
          const figure = data.entity;
          console.log('hasBeenCollectedHide: figureId:', figureId);
          findFigureContainer(figureId, figure);
        }
      },
      false
    );
  }

  function findFigureContainer(figureId, figure) {
    const figureContainer = worldContainer.getChildByName(figureId);

    hideFigureSprite(figureId, figure, figureContainer);
  }

  function hideFigureSprite(figureId, figure, figureContainer) {
    const sprite = figureContainer.getChildByName('sprite');
    sprite.visible = false;
  }
};
