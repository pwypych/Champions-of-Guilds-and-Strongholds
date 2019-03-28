// @format

'use strict';

g.battle.unitsDraw = (walkie, auth, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferanceDone();
  })();

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'viewportBattleReady_',
      'unitsDraw.js',
      () => {
        findBattleEntity();
      },
      false
    );
  }

  function findBattleEntity() {
    let battleEntity;
    _.forEach(freshEntities(), (entity) => {
      if (entity.attackerId && entity.defenderId) {
        battleEntity = entity;
      }
    });

    findPlayerId(battleEntity);
  }

  function findPlayerId(battleEntity) {
    let playerId;
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        playerId = id;
      }
    });

    findPlayerUnitBoss(playerId, battleEntity);
  }

  function findPlayerUnitBoss(playerId, battleEntity) {
    let boss;
    _.forEach(freshEntities(), (entity) => {
      if (entity.unitStats && entity.owner === playerId) {
        boss = entity.boss;
      }
    });
    forEachUnit(boss, battleEntity);
  }

  function forEachUnit(boss, battleEntity) {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitName && entity.position && !entity.dead) {
        instantiateUnitContainer(entity, id, boss, battleEntity);
      }
    });
  }

  function instantiateUnitContainer(entity, unitId, boss, battleEntity) {
    let unitContainer = battleContainer.getChildByName(unitId);

    if (!unitContainer) {
      // console.log('unitsDraw: unit container', id);
      unitContainer = new PIXI.ContainerZ();
      unitContainer.name = unitId;
      const zOrder = 100 + entity.position.y;
      battleContainer.addChildZ(unitContainer, zOrder);

      unitContainer.x = entity.position.x * blockWidthPx;
      unitContainer.y = entity.position.y * blockHeightPx;
    }

    instantiateSprite(entity, unitId, unitContainer, boss, battleEntity);
  }

  function instantiateSprite(
    entity,
    unitId,
    unitContainer,
    boss,
    battleEntity
  ) {
    let sprite = unitContainer.getChildByName('sprite');

    // Should happen only once
    if (!sprite) {
      // console.log('unitsDraw: unit sprite', unitId, 'sprite');
      const texture = PIXI.loader.resources[entity.unitName].texture;
      sprite = new PIXI.Sprite(texture);
      sprite.name = 'sprite';

      if (entity.spriteOffset) {
        sprite.x += entity.spriteOffset.x;
        sprite.y += entity.spriteOffset.y;
      }

      const zOrder = 5;
      unitContainer.addChildZ(sprite, zOrder);
      unitContainer.sortChildren();
    }

    instantiateAmount(entity, unitId, unitContainer, boss, battleEntity);
  }

  function instantiateAmount(
    entity,
    unitId,
    unitContainer,
    boss,
    battleEntity
  ) {
    let amount = unitContainer.getChildByName('amount');

    // Should happen only once
    if (!amount) {
      // console.log('drawAmount', unitId, 'amount');
      const amountTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 12,
        fontWeight: 'bolder',
        fill: 'white',
        strokeThickness: 2
      });

      let unitAmount = entity.amount;
      if (
        battleEntity.attackerId !== boss &&
        entity.boss !== boss &&
        entity.unitStats
      ) {
        unitAmount = '?';
      }

      amount = new PIXI.Text(unitAmount, amountTextStyle);
      amount.name = 'amount';
      const zOrder = 10;
      unitContainer.addChildZ(amount, zOrder);
      unitContainer.sortChildren();

      const paddingRight = 2;
      const paddingTop = 3;
      amount.x = blockWidthPx - amount.width + paddingRight;
      amount.y = blockHeightPx - amount.height + paddingTop;
    }
  }
};
