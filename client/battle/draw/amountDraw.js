// @format

'use strict';

g.battle.amountDraw = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onEntitiesGet();
  })();

  function onEntitiesGet() {
    walkie.onEvent(
      'entitiesGet_',
      'amountDraw.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        findPlayerId();
      },
      false
    );
  }

  function findPlayerId() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.playerCurrent) {
        const playerId = id;
        findActiveUnit(playerId);
      }
    });
  }

  function findActiveUnit(playerId) {
    _.forEach(freshEntities(), (entity, id) => {
      const unitId = id;

      if (entity.unitName && entity.position && !entity.dead) {
        let isEnemy = false;
        if (entity.owner !== playerId) {
          isEnemy = true;
        }
        drawAmount(entity, unitId, isEnemy);
      } else {
        hideAmount(unitId);
      }
    });
  }

  function hideAmount(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);
    if (unitContainer) {
      const amount = unitContainer.getChildByName('amount');
      if (amount) {
        amount.visible = false;
      }
    }
  }

  function drawAmount(entity, unitId, isEnemy) {
    const unitContainer = battleContainer.getChildByName(unitId);
    let amount = unitContainer.getChildByName('amount');

    // Should happen only once
    if (!amount) {
      let fill = 'white';
      let stroke = 'black';

      if (isEnemy) {
        fill = 'black';
        stroke = 'white';
      }

      // console.log('drawAmount', unitId, 'amount');
      const amountTextStyle = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: 13,
        fontWeight: 'bolder',
        fill: fill,
        stroke: stroke,
        strokeThickness: 2
      });

      amount = new PIXI.Text(entity.amount, amountTextStyle);
      amount.name = 'amount';
      const zOrder = 10;
      unitContainer.addChildZ(amount, zOrder);
      unitContainer.sortChildren();

      const paddingRight = 2;
      const paddingTop = 3;
      amount.x = blockWidthPx - amount.width + paddingRight;
      amount.y = blockHeightPx - amount.height + paddingTop;
    }

    amount.text = entity.amount;
  }
};
