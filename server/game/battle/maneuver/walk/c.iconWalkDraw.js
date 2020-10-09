// @format

'use strict';

// What does this module do?
// Draws all hidden walk icons once on whole battle area
g.autoload.iconWalkDraw = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;
  const freshEntities = inject.freshEntities;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onViewportBattleReady();
  })();

  function onViewportBattleReady() {
    walkie.onEvent(
      'viewportBattleReady_',
      'iconWalkDraw.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconWalkContainer = battleContainer.getChildByName(
      'iconWalkContainer'
    );

    if (!iconWalkContainer) {
      iconWalkContainer = new PIXI.Container();
      iconWalkContainer.name = 'iconWalkContainer';
      battleContainer.addChildZ(iconWalkContainer, 3);
    }

    let battleWidth;
    let battleHeight;

    if (iconWalkContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconWalk_' + x + '_' + y;

          const textureName = 'iconMovement';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconWalkContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.2;
          icon.visible = false;
        });
      });
    }
  }
};
