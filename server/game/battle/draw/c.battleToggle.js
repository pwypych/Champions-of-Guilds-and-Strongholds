// @format

'use strict';

g.autoload.battleToggle = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');
  const worldContainer = viewport.getChildByName('worldContainer');

  (function init() {
    onEntitiesGetFirst();
  })();

  function onEntitiesGetFirst() {
    walkie.onEvent(
      'entitiesGetFirst_',
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

    triggerViewportReady();
  }

  function triggerViewportReady() {
    walkie.triggerEvent('viewportBattleReady_', 'battleToggle.js', {}, true);
  }
};
