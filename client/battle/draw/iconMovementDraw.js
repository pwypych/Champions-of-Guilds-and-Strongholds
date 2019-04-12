// @format

'use strict';

g.battle.iconMovementDraw = (walkie, viewport, freshEntities) => {
  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onViewportBattleReady();
  })();

  function onViewportBattleReady() {
    walkie.onEvent(
      'viewportBattleReady_',
      'iconMovementDraw.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconMovementContainer = battleContainer.getChildByName(
      'iconMovementContainer'
    );

    if (!iconMovementContainer) {
      iconMovementContainer = new PIXI.Container();
      iconMovementContainer.name = 'iconMovementContainer';
      battleContainer.addChildZ(iconMovementContainer, 3);
    }

    let battleWidth;
    let battleHeight;

    if (iconMovementContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconMovement_' + x + '_' + y;

          const textureName = 'iconMovement';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconMovementContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.2;
          icon.visible = false;
        });
      });
    }
  }
};
