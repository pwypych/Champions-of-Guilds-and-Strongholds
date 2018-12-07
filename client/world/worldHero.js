// @format

'use strict';

g.world.worldHero = (walkie, auth, viewport) => {
  let stateData;
  let sprite;

  let lastKnownX;
  let lastKnownY;

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
    $('body').css('cursor', 'default');

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

    checkPositionChange(x, y);
  }

  function checkPositionChange(x, y) {
    console.log('hero now: ', y, x);
    console.log('last known: ', lastKnownY, lastKnownX);
    if (typeof lastKnownX === 'undefined') {
      lastKnownX = x;
    }

    if (typeof lastKnownY === 'undefined') {
      lastKnownY = y;
    }

    if (lastKnownX !== x || lastKnownY !== y) {
      tweenHeroToNewPosition(x, y);
    }
  }

  function tweenHeroToNewPosition(moveToX, moveToY) {
    const heroSpriteOffsetX = -9;

    const tweenX = moveToX * blockWidthPx + heroSpriteOffsetX;
    const tweenY = moveToY * blockHeightPx + blockHeightPx;
    const heroX = lastKnownX * blockWidthPx + heroSpriteOffsetX;
    const heroY = lastKnownY * blockHeightPx + blockHeightPx;

    lastKnownX = moveToX;
    lastKnownY = moveToY;

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
    tween.time = 24000;
    tween.loop = false;
    tween.start();
  }

  function onHeroMoveTo() {
    walkie.onEvent('heroMoveTo_', 'worldHero.js', () => {
      $('body').css('cursor', 'wait');
    });
  }
};
