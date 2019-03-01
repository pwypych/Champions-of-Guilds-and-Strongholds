// @format

'use strict';

g.battle.drawUnits = (walkie, auth, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferanceDone();
  })();

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'recentActivityDifferanceDone_',
      'drawUnits.js',
      () => {
        const gameEntity = freshEntities()[freshEntities()._id];

        if (gameEntity.state !== 'battleState') {
          return;
        }

        forEachFigure();
      },
      false
    );
  }

  function forEachFigure() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitName && entity.position && !entity.dead) {
        instantiateUnitContainer(entity, id);
      }
    });
  }

  function instantiateUnitContainer(entity, unitId) {
    let unitContainer = battleContainer.getChildByName(unitId);

    if (!unitContainer) {
      // console.log('drawUnits: unit container', id);
      unitContainer = new PIXI.Container();
      unitContainer.name = unitId;
      const zOrder = 100 + entity.position.y;
      battleContainer.addChildZ(unitContainer, zOrder);

      unitContainer.x = entity.position.x * blockWidthPx;
      unitContainer.y = entity.position.y * blockHeightPx;
    }

    instantiateSprite(entity, unitId, unitContainer);
  }

  // function instantiateMarker(entity, unitId, unitContainer) {
  //   let marker = unitContainer.getChildByName('marker');
  //
  //   // Should happen only once
  //   if (!marker) {
  //     // console.log('drawActiveUnitMarker', unitId, 'marker');
  //     const textureName = 'activeUnitMarker';
  //     const texture = PIXI.loader.resources[textureName].texture;
  //     marker = new PIXI.Sprite(texture);
  //     marker.name = 'marker';
  //     unitContainer.addChild(marker);
  //
  //     const offsetY = 2;
  //     marker.x = 0;
  //     marker.y = offsetY;
  //   }
  //
  //   if (entity.active) {
  //     marker.visible = true;
  //   } else {
  //     marker.visible = false;
  //   }
  //
  //   instantiateSprite(entity, unitId, unitContainer);
  // }

  function instantiateSprite(entity, unitId, unitContainer) {
    let sprite = unitContainer.getChildByName('sprite');

    // Should happen only once
    if (!sprite) {
      // console.log('drawUnits: unit sprite', unitId, 'sprite');
      const texture = PIXI.loader.resources[entity.unitName].texture;
      sprite = new PIXI.Sprite(texture);
      sprite.name = 'sprite';

      if (entity.spriteOffset) {
        sprite.x += entity.spriteOffset.x;
        sprite.y += entity.spriteOffset.y;
      }

      unitContainer.addChild(sprite);
    }

    instantiateAmount(entity, unitId, unitContainer);
  }

  function instantiateAmount(entity, unitId, unitContainer) {
    let amount = unitContainer.getChildByName('amount');

    // Should happen only once
    if (!amount) {
      // console.log('drawAmount', unitId, 'amount');
      const amountTextStyle = new PIXI.TextStyle({
        fontFamily: 'Courier New',
        fontSize: 12,
        fontWeight: 'bolder',
        fill: 'white',
        strokeThickness: 2
      });

      amount = new PIXI.Text(entity.amount, amountTextStyle);
      amount.name = 'amount';
      unitContainer.addChild(amount);

      const paddingRight = 2;
      const paddingTop = 3;
      amount.x = blockWidthPx - amount.width + paddingRight;
      amount.y = blockHeightPx - amount.height + paddingTop;
    }
  }
};
