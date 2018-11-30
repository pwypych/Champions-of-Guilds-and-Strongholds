// @format

'use strict';

g.world.worldHero = (walkie, auth, viewport) => {
  let stateData;
  let sprite;

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
        findHero();
      },
      false
    );
  }

  function findHero() {
    const hero = stateData.playerArray[stateData.playerIndex].hero;
    instantiateHeroSprite(hero.x, hero.y);
  }

  function instantiateHeroSprite(x, y) {
    const figureName = 'heroHuman';
    const texture = PIXI.loader.resources[figureName].texture;
    sprite = new PIXI.Sprite(texture);

    sprite.anchor = { x: 0, y: 1 };

    sprite.x = x * blockWidthPx;
    sprite.y = y * blockHeightPx + blockHeightPx;

    const heroSpriteOffsetX = -9;
    sprite.x += heroSpriteOffsetX;

    viewport.addChild(sprite);
  }

  function onHeroMoveTo() {
    walkie.onEvent('heroMoveTo_', 'worldHero.js', (data) => {
      const heroSpriteOffsetX = -9;

      const tweenX = data.moveToX * blockWidthPx + heroSpriteOffsetX;
      const tweenY = data.moveToY * blockHeightPx + blockHeightPx;
      const heroX = sprite.x;
      const heroY = sprite.y;
      console.log(
        'end slide on:',
        tweenX,
        tweenY,
        'hero currently on:',
        heroX,
        heroY
      );

      const path = new PIXI.tween.TweenPath();
      path.moveTo(heroX, heroY).lineTo(tweenX, tweenY);

      const gPath = new PIXI.Graphics();
      gPath.lineStyle(1, 0xffffff, 1);
      gPath.drawPath(path);
      viewport.addChild(gPath);

      const tween = PIXI.tweenManager.createTween(sprite);
      tween.path = path;
      tween.time = 12000;
      tween.loop = false;
      tween.start();
    });
  }
};
