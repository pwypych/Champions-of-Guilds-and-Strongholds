// @format

'use strict';

g.autoload.unitsDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

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
        forEachUnit();
      },
      false
    );
  }

  function forEachUnit() {
    _.forEach(freshEntities(), (entity, id) => {
      if (entity.unitName && entity.position && !entity.dead) {
        instantiateUnitContainer(entity, id);
      }
    });

    triggerUnitsDrawn();
  }

  function instantiateUnitContainer(entity, unitId) {
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

    instantiateSprite(entity, unitId, unitContainer);
  }

  function instantiateSprite(entity, unitId, unitContainer) {
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

      if (entity.mirrorSprite) {
        sprite.x += blockWidthPx;
        sprite.scale.x = -1;
      }

      let zOrder = 5;

      if (entity.unitStats) {
        zOrder = 10;
      }

      unitContainer.addChildZ(sprite, zOrder);
      unitContainer.sortChildren();
    }
  }

  function triggerUnitsDrawn() {
    walkie.triggerEvent(
      'unitsDrawn_',
      'unitsDraw.js',
      {},
      true
    );
  }
};
