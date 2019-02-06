// @format

'use strict';

g.battle.finishedModal = ($body, walkie, auth, freshEntities) => {
  const $finishedModal = $body.find('#js-battle-finished-modal');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'finishedModal.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findBattleEntity();
      },
      false
    );
  }

  function findBattleEntity() {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.battleStatus === 'finished') {
        battleEntity = entity;
      }
    });

    if (!battleEntity) {
      return;
    }

    $finishedModal.show();
  }
};
