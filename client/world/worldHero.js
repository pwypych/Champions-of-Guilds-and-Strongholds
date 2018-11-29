// @format

'use strict';

g.world.worldHero = (walkie, auth, viewport) => {
  let stateData;

  const blockWidthPx = 32;
  const blockHeightPx = 32;

  (function init() {
    onStateChange();
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
    stateData.playerArray.forEach((player) => {
      instantiateHeroSprite(player.hero.x, player.hero.y);
    });
  }

  function instantiateHeroSprite(x, y) {
    const texture = PIXI.loader.resources['heroHuman'].texture;
    const sprite = new PIXI.Sprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = x * blockWidthPx;
    sprite.y = y * blockHeightPx + blockHeightPx;

    const heroSpriteOffsetX = -9;
    sprite.x += heroSpriteOffsetX;

    viewport.addChild(sprite);
  }
};
