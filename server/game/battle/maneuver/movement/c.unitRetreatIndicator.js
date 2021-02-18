// @format

'use strict';

// What does this module do?
// Renders retreat indicator after unit moves/runs from an enemy that is standing near
g.autoload.unitRetreatIndicator = (inject) => {
  const walkie = inject.walkie;
  const viewport = inject.viewport;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFoundEvent_',
      'unitRetreatIndicator.js',
      (data) => {
        if (data.entity.recentActivity.name === 'onMovement') {
          const entityId = data.entityId;
          const path = data.entity.recentActivity.path;
          const positionInitial = path[0];

          forEachPositionAroundUnit(entityId, positionInitial);
        }
      },
      false
    );
  }

  function forEachPositionAroundUnit(entityId, positionInitial) {
    const entities = freshEntities();
    const unit = entities[entityId];

    let positionEnemy;

    [{ x: 0, y: -1 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 0 }].forEach(
      (offset) => {
        const positionMaybeEnemy = {};
        positionMaybeEnemy.x = positionInitial.x + offset.x;
        positionMaybeEnemy.y = positionInitial.y + offset.y;
        // console.log('forEachPositionAroundUnit:unitPosition:', positionInitial);
        // console.log('forEachPositionAroundUnit:position:', position);
        if (toolIsEnemyOnPosition(entities, unit, positionMaybeEnemy)) {
          positionEnemy = positionMaybeEnemy;
        }
      }
    );

    if (positionEnemy) {
      console.log(
        // 'unitRetreatIndicator: Yes, enemy found nearby!',
        positionEnemy
      );
      instantiateIndicator(positionInitial);
    }

    // console.log('unitRetreatIndicator: No enemy to escape!');
  }

  function toolIsEnemyOnPosition(entities, unit, positionMaybeEnemy) {
    let isEnemy;

    _.forEach(entities, (entity) => {
      if (unit.boss !== entity.boss) {
        if (entity.unitName && entity.unitStats && !entity.dead) {
          if (
            entity.position.x === positionMaybeEnemy.x &&
            entity.position.y === positionMaybeEnemy.y
          ) {
            isEnemy = true;
          }
        }
      }
    });

    return isEnemy;
  }

  function instantiateIndicator(position) {
    const amountTextStyle = new PIXI.TextStyle({
      fontFamily: 'Arial',
      fontSize: 13,
      fontWeight: 'bolder',
      fill: 'white',
      strokeThickness: 2
    });

    const amountText = new PIXI.Text('Retreat!', amountTextStyle);
    amountText.name = 'hasBeenCollectedIndicator';
    battleContainer.addChild(amountText);
    amountText.x =
      blockWidthPx * position.x + blockWidthPx / 2 - amountText.width / 2;
    amountText.y =
      blockHeightPx * position.y + blockHeightPx / 2 - amountText.height / 2;

    destroyAfterTimeout(amountText);
  }

  function destroyAfterTimeout(amountText) {
    setTimeout(() => {
      amountText.destroy();
    }, 500);
  }
};
