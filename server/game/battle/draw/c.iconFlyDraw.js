// @format

'use strict';

g.autoload.iconFlyDraw = (inject) => {
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
      'iconFlyDraw.js',
      () => {
        drawIconsOnce();
      },
      false
    );
  }

  function drawIconsOnce() {
    let iconFlyContainer = battleContainer.getChildByName('iconFlyContainer');

    if (!iconFlyContainer) {
      iconFlyContainer = new PIXI.Container();
      iconFlyContainer.name = 'iconFlyContainer';
      battleContainer.addChildZ(iconFlyContainer, 3);
    }

    let battleWidth;
    let battleHeight;

    if (iconFlyContainer.children.length < 1) {
      _.forEach(freshEntities(), (entity) => {
        if (entity.battleStatus === 'active') {
          battleWidth = entity.battleWidth;
          battleHeight = entity.battleHeight;
        }
      });

      _.times(battleWidth, (x) => {
        _.times(battleHeight, (y) => {
          const iconName = 'iconFly_' + x + '_' + y;

          const textureName = 'iconMovement';
          const texture = PIXI.loader.resources[textureName].texture;
          const icon = new PIXI.Sprite(texture);
          icon.name = iconName;
          iconFlyContainer.addChild(icon);

          icon.x = x * blockWidthPx;
          icon.y = y * blockHeightPx;
          icon.alpha = 0.2;
          icon.visible = false;
        });
      });
    }
  }
};
