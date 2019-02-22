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
    onRecentActivityDifferanceDone();
  })();

  function onRecentActivityDifferanceDone() {
    walkie.onEvent(
      'recentActivityDifferanceDone_',
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
    let pixiText;

    if (battleContainer.getChildByName(name)) {
      pixiText = battleContainer.getChildByName(name);
    }

    if (!battleContainer.getChildByName(name)) {
      // console.log('drawAmount', name);
      pixiText = new PIXI.Text(entity.amount, textStyle);
      pixiText.name = name;
      battleContainer.addChildZ(pixiText, 1000);

      const paddingRight = 2;
      const paddingTop = 3;
      pixiText.x =
        entity.position.x * blockWidthPx +
        blockWidthPx -
        pixiText.width +
        paddingRight;
      pixiText.y =
        entity.position.y * blockHeightPx +
        blockHeightPx -
        pixiText.height +
        paddingTop;
    }
  }
};
