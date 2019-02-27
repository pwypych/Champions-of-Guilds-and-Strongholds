// @format

'use strict';

g.battle.unitJustDiedHide = (walkie, viewport) => {
  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitJustDiedHide.js',
      (data) => {
        if (data.entity.recentActivity.name === 'justDied') {
          const figureId = data.entityId;
          const figure = data.entity;
          console.log('unitJustDiedHide: figureId:', figureId);
          findFigureContainer(figureId, figure);
        }
      },
      false
    );
  }

  function findFigureContainer(figureId, figure) {
    const figureContainer = battleContainer.getChildByName(figureId);

    hideFigureSprite(figureId, figure, figureContainer);
  }

  function hideFigureSprite(figureId, figure, figureContainer) {
    const sprite = figureContainer.getChildByName('sprite');
    sprite.visible = false;

    const amount = figureContainer.getChildByName('amount');
    amount.visible = false;
  }
};
