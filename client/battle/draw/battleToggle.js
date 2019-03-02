// @format

'use strict';

g.battle.battleToggle = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'battleToggle.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        battleShow();
      },
      false
    );
  }

  function battleShow() {
    battleContainer.visible = true;
    worldContainer.visible = false;

    console.log('battleToggle.js: battleShow()');

    findBattleEntity();
  }

  function findBattleEntity() {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'active') {
        battleEntity = entity;
      }
    });

    if (!battleEntity) {
      return;
    }

    setViewportDimentions(battleEntity);
  }

  function setViewportDimentions(battleEntity) {
    viewport.worldWidth = battleEntity.battleWidth * blockWidthPx;
    viewport.worldHeight = battleEntity.battleHeight * blockHeightPx;
  }
};
