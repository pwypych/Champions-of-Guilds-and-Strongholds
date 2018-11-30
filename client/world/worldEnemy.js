// @format

'use strict';

g.world.worldEnemy = (walkie, auth, viewport) => {
  let stateData;
  let isMoving = false;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onStateChange();
    onHeroMoveTo();
  })();

  function onStateChange() {
    walkie.onEvent(
      'worldRenderDone_',
      'worldHero.js',
      (data) => {
        stateData = data;
        forEachPlayer();
      },
      false
    );
  }

  function forEachPlayer() {
    stateData.playerArray.forEach((player, index) => {
      instantiateHeroSprite(player.hero.x, player.hero.y);
    });
  }

  function instantiateHeroSprite(x, y) {
    const figureName = 'heroHuman';
    const texture = PIXI.loader.resources[figureName].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = x * blockWidthPx;
    sprite.y = y * blockHeightPx + blockHeightPx;

    const heroSpriteOffsetX = -9;
    sprite.x += heroSpriteOffsetX;

    viewport.addChild(sprite);
  }

  function onHeroMoveTo() {
    walkie.onEvent('heroMoveTo_', 'worldHero.js', () => {
      isMoving = true;
      setTimeout(() => {
        isMoving = false;
      });
    });
  }
};
