// @format

'use strict';

// What does this module do?
// Renders slash animation after unit gotHit or justDiedHit with melee attack
g.autoload.unitGotHitAnimation = (inject) => {
  const viewport = inject.viewport;
  const walkie = inject.walkie;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  const battleContainer = viewport.getChildByName('battleContainer');

  (function init() {
    onRecentActivityDifferance();
  })();

  function onRecentActivityDifferance() {
    walkie.onEvent(
      'recentActivityDifferanceFound_',
      'unitGotHitAnimation.js',
      (data) => {
        if (data.entity.recentActivity.name === 'gotHit') {
          const unitId = data.entityId;
          console.log('unitGotHitAnimation: unitId:', unitId);
          findUnitContainer(unitId);
        }

        if (data.entity.recentActivity.name === 'justDiedHit') {
          const unitId = data.entityId;
          console.log('unitGotHitAnimation: unitId:', unitId);
          findUnitContainer(unitId);
        }
      },
      false
    );
  }

  function findUnitContainer(unitId) {
    const unitContainer = battleContainer.getChildByName(unitId);

    instantiateAnimation(unitContainer);
  }

  function instantiateAnimation(unitContainer) {
    const textureArray = [];

    _.times(12, (index) => {
      const textureName = 'hitSlash' + index;
      const texture = PIXI.loader.resources[textureName].texture;
      textureArray.push(texture);
    });

    const animated = new PIXI.extras.AnimatedSprite(textureArray);

    animated.name = 'hitSlash';
    animated.x = (blockWidthPx - animated.width) / 2;
    animated.y = (blockHeightPx - animated.height) / 2;
    animated.loop = false;
    animated.play();

    unitContainer.addChild(animated);

    destroyAfterTimeout(animated);
  }

  function destroyAfterTimeout(animated) {
    setTimeout(() => {
      animated.destroy();
    }, 1000);
  }
};
