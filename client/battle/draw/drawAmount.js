// @format

'use strict';

g.battle.drawAmount = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  const textStyle = new PIXI.TextStyle({
    fontFamily: 'Courier New',
    fontSize: 12,
    fontWeight: 'bolder',
    fill: 'white',
    strokeThickness: 2
  });

  (function init() {
    onRecentManeuverDifferanceDone();
  })();

  function onRecentManeuverDifferanceDone() {
    walkie.onEvent(
      'recentManeuverDifferanceDone_',
      'drawAmount.js',
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
      if (entity.unitName && entity.position) {
        drawAmount(entity, id);
      }
    });
  }

  function drawAmount(entity, unitId) {
    const name = 'amount_' + unitId;
    let textAmount;

    if (battleContainer.getChildByName(name)) {
      textAmount = battleContainer.getChildByName(name);
    }

    if (!battleContainer.getChildByName(name)) {
      // console.log('drawAmount', name);
      textAmount = new PIXI.Text(entity.amount, textStyle);
      textAmount.name = name;
      battleContainer.addChildZ(textAmount, 1000);
    }

    const paddingRight = 2;
    const paddingTop = 3;
    textAmount.x =
      entity.position.x * blockWidthPx +
      blockWidthPx -
      textAmount.width +
      paddingRight;
    textAmount.y =
      entity.position.y * blockHeightPx +
      blockHeightPx -
      textAmount.height +
      paddingTop;
  }
};
