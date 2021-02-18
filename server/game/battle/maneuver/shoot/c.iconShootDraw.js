// @format

'use strict';

// What does this module do?
// Draws all hidden shoot icons once on whole battle area
g.autoload.iconShootDraw = (inject) => {
  const walkie = inject.walkie;
  const viewport = inject.viewport;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onViewportBattleReady();
  })();

  function onViewportBattleReady() {
    walkie.onEvent(
      'viewportBattleReadyEvent_',
      'iconShootDraw.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconShootContainer = battleContainer.getChildByName(
      'iconShootContainer'
    );

    if (!iconShootContainer) {
      iconShootContainer = new PIXI.Container();
      iconShootContainer.name = 'iconShootContainer';
      battleContainer.addChildZ(iconShootContainer, 10000);
    }

    let battleWidth;
    let battleHeight;

    if (iconShootContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconShoot_' + x + '_' + y;

          const textureName = 'iconShoot';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconShootContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.55;
          icon.visible = false;
        });
      });
    }
  }
};
